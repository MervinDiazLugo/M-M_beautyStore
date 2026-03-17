// pages/api/admin/sales/[id].js
import { supabase } from '../../../../lib/supabase';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (method === 'DELETE') {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
