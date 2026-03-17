// pages/api/admin/ml/callback.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  const { method } = req;
  const { code } = req.query;

  if (method === 'GET' && code) {
    const CLIENT_ID = process.env.MERCADOLIBRE_CLIENT_ID;
    const CLIENT_SECRET = process.env.MERCADOLIBRE_CLIENT_SECRET;
    const REDIRECT_URI = process.env.ML_REDIRECT_URI || 'http://localhost:3000/api/admin/ml/callback';

    try {
      const tokenResponse = await fetch('https://api.mercadolibre.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
        let userId = tokenData.user_id;
        
        // If user_id not in token response, get it from API
        if (!userId) {
          const userResponse = await fetch('https://api.mercadolibre.com/users/me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          });
          const userData = await userResponse.json();
          userId = userData.id;
        }

        // Save token to Supabase
        await supabaseAdmin.from('settings').upsert({
          key: 'ml_access_token',
          value: tokenData.access_token,
        }, { onConflict: 'key' });

        await supabaseAdmin.from('settings').upsert({
          key: 'ml_refresh_token',
          value: tokenData.refresh_token,
        }, { onConflict: 'key' });

        await supabaseAdmin.from('settings').upsert({
          key: 'ml_token_expires_at',
          value: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        }, { onConflict: 'key' });

        await supabaseAdmin.from('settings').upsert({
          key: 'ml_user_id',
          value: userId,
        }, { onConflict: 'key' });

        // Redirect to admin with success
        res.writeHead(302, { Location: '/admin?ml=connected' });
        res.end();
        return;
      } else {
        return res.status(400).json({ error: 'Error obtaining token', details: tokenData });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
