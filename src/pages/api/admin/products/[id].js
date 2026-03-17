// pages/api/admin/products/[id].js
import { supabase } from '../../../../lib/supabase';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.status(200).json(data);
  }

  if (method === 'PUT' || method === 'PATCH') {
    const { cost, packaging_cost } = req.body;
    const updates = {};
    
    if (cost !== undefined) updates.cost = cost;
    if (packaging_cost !== undefined) updates.packaging_cost = packaging_cost;

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'PUT', 'PATCH']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
