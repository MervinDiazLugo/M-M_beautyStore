// pages/api/admin/products/index.js
import { supabase } from '../../../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, cost, packaging_cost, image')
      .order('name');
    
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
