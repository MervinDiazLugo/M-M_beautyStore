import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';
import { ML_STORE_PRICE_FACTOR } from '../../../../lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

const ML_API_URL = 'https://api.mercadolibre.com';

async function refreshToken() {
  const { data: refreshTokenData } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'ml_refresh_token')
    .single();

  const refreshToken = refreshTokenData?.value;
  if (!refreshToken) return null;

  const CLIENT_ID = process.env.MERCADOLIBRE_CLIENT_ID;
  const CLIENT_SECRET = process.env.MERCADOLIBRE_CLIENT_SECRET;

  try {
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
      }),
    });

    if (!tokenRes.ok) return null;
    const tokenData = await tokenRes.json();

    await supabaseAdmin
      .from('settings')
      .upsert({ key: 'ml_access_token', value: tokenData.access_token }, { onConflict: 'key' });

    if (tokenData.refresh_token) {
      await supabaseAdmin
        .from('settings')
        .upsert({ key: 'ml_refresh_token', value: tokenData.refresh_token }, { onConflict: 'key' });
    }

    return tokenData.access_token;
  } catch {
    return null;
  }
}

async function getAccessToken() {
  const { data } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'ml_access_token')
    .single();
  return data?.value;
}

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, price, updateMl = false } = req.body;

  if (!id || price === undefined) {
    return res.status(400).json({ error: 'id y price son requeridos' });
  }

  try {
    let product;
    let mlItemId;

    const { data: byMlId } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('ml_item_id', id)
      .single();
    
    if (byMlId) {
      product = byMlId;
      mlItemId = byMlId.ml_item_id;
    } else {
      const { data: byId } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      product = byId;
      mlItemId = byId?.ml_item_id || id;
    }

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    let mlUpdated = false;
    let mlError = null;
    let finalStorePrice = parseInt(price);

    if (updateMl) {
      await refreshToken();
      const token = await getAccessToken();

      if (token) {
        const mlPrice = parseInt(price);
        const storePrice = Math.round(mlPrice * ML_STORE_PRICE_FACTOR);
        finalStorePrice = storePrice;

        console.log('Updating prices:', { mlItemId, mlPrice, storePrice });

        const mlRes = await fetch(`${ML_API_URL}/items/${mlItemId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ price: mlPrice }),
        });

        const responseText = await mlRes.text();
        console.log('ML response:', mlRes.status, responseText);

        if (mlRes.ok) {
          mlUpdated = true;
          await supabaseAdmin
            .from('products')
            .update({ 
              price: storePrice,
              ml_price: mlPrice
            })
            .eq('id', product.id);
        } else {
          mlError = { status: mlRes.status, body: responseText };
        }
      }
    } else {
      await supabaseAdmin
        .from('products')
        .update({ price: parseInt(price) })
        .eq('id', product.id);
    }

    return res.status(200).json({
      success: true,
      updatedPrice: finalStorePrice,
      mlUpdated,
      mlError,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
