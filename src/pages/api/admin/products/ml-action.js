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

  try {
    const tokenRes = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.MERCADOLIBRE_CLIENT_ID,
        client_secret: process.env.MERCADOLIBRE_CLIENT_SECRET,
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

  const { action, productId, mlItemId, price, status } = req.body;

  if (!action || !productId) {
    return res.status(400).json({ error: 'action y productId son requeridos' });
  }

  await refreshToken();
  const token = await getAccessToken();

  if (!token) {
    return res.status(401).json({ error: 'No connected to MercadoLibre' });
  }

  try {
    if (action === 'updateStatus') {
      if (!mlItemId || status === undefined) {
        return res.status(400).json({ error: 'mlItemId y status son requeridos' });
      }

      const mlStatus = status ? 'active' : 'paused';
      const mlRes = await fetch(`${ML_API_URL}/items/${mlItemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: mlStatus }),
      });

      if (!mlRes.ok) {
        const errorText = await mlRes.text();
        return res.status(mlRes.status).json({ error: errorText });
      }

      await supabaseAdmin
        .from('products')
        .update({ published: status })
        .eq('id', productId);

      return res.status(200).json({ success: true, mlStatus });
    }

    if (action === 'updatePrice') {
      if (!mlItemId || price === undefined) {
        return res.status(400).json({ error: 'mlItemId y price son requeridos' });
      }

      const mlPrice = Math.round(price);
      const storePrice = Math.round(mlPrice * ML_STORE_PRICE_FACTOR);

      const mlRes = await fetch(`${ML_API_URL}/items/${mlItemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: mlPrice }),
      });

      if (!mlRes.ok) {
        const errorText = await mlRes.text();
        return res.status(mlRes.status).json({ error: errorText });
      }

      await supabaseAdmin
        .from('products')
        .update({ price: storePrice, ml_price: mlPrice })
        .eq('id', productId);

      return res.status(200).json({ success: true, mlPrice, storePrice });
    }

    return res.status(400).json({ error: 'Action no válida' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
