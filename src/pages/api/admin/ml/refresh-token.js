// pages/api/admin/ml/refresh-token.js
import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

const CLIENT_ID = process.env.MERCADOLIBRE_CLIENT_ID;
const CLIENT_SECRET = process.env.MERCADOLIBRE_CLIENT_SECRET;

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;
  
  if (req.method === 'POST') {
    try {
      const { data: refreshTokenData } = await supabaseAdmin
        .from('settings')
        .select('value')
        .eq('key', 'ml_refresh_token')
        .single();

      const refreshToken = refreshTokenData?.value;

      if (!refreshToken) {
        return res.status(400).json({ error: 'No hay refresh token' });
      }

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

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok) {
        return res.status(400).json({ error: 'No se pudo refrescar el token', details: tokenData });
      }

      await supabaseAdmin.from('settings').upsert({ key: 'ml_access_token', value: tokenData.access_token });
      await supabaseAdmin.from('settings').upsert({ key: 'ml_refresh_token', value: tokenData.refresh_token });

      return res.status(200).json({ success: true, expires_in: tokenData.expires_in });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end();
}
