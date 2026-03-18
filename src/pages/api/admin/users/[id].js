// pages/api/admin/users/[id].js
import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;
  
  const { method, query } = req;
  const { id } = query;

  if (method === 'DELETE') {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
