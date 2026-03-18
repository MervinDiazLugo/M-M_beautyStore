// pages/api/admin/ml/status.js
import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;
  
  if (req.method === 'GET') {
    const { data } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'ml_access_token')
      .single();

    const connected = !!data?.value;
    return res.status(200).json({ connected });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
