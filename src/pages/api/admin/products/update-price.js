import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';

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
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const mlItemId = product.ml_item_id;
    if (!mlItemId) {
      return res.status(400).json({ error: 'Este producto no tiene ID de MercadoLibre. Sincronizá primero desde ML.' });
    }

    await supabaseAdmin
      .from('products')
      .update({ price: parseInt(price) })
      .eq('id', id);

    let mlUpdated = false;
    if (updateMl) {
      await refreshToken();
      const token = await getAccessToken();

      if (token) {
        console.log('Updating ML price:', { mlItemId, price });
        const mlRes = await fetch(`${ML_API_URL}/items/${mlItemId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ price: parseInt(price) }),
        });

        console.log('ML response:', mlRes.status, await mlRes.text());

        if (mlRes.ok) {
          mlUpdated = true;
        }
      }
    }

    return res.status(200).json({
      success: true,
      updatedPrice: parseInt(price),
      mlUpdated,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
