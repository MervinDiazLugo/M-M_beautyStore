// pages/api/admin/ml/disconnect.js
import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;
  
  if (req.method === 'POST') {
    await supabaseAdmin.from('settings').delete().eq('key', 'ml_access_token');
    await supabaseAdmin.from('settings').delete().eq('key', 'ml_refresh_token');
    await supabaseAdmin.from('settings').delete().eq('key', 'ml_token_expires_at');
    await supabaseAdmin.from('settings').delete().eq('key', 'ml_user_id');

    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
