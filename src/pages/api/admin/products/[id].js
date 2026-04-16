// pages/api/admin/products/[id].js
import { supabase, calculateSuggestedPrice, calculateMinimumPrice, DEFAULT_PACKAGING_COST } from '../../../../lib/supabase';
import { validateApiKey } from '../../../../lib/apiAuth';

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;
  
  const { method, query } = req;
  const { id } = query;

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Producto no encontrado' });

    const packagingCost = data.packaging_cost || DEFAULT_PACKAGING_COST;
    const suggested_price = calculateSuggestedPrice(data.cost || 0, packagingCost);
    const minimum_price = calculateMinimumPrice(data.cost || 0, packagingCost);
    return res.status(200).json({ ...data, suggested_price, minimum_price });
  }

  if (method === 'PUT' || method === 'PATCH') {
    const { cost, packaging_cost, price } = req.body;
    const updates = {};
    
    if (cost !== undefined) updates.cost = cost;
    if (packaging_cost !== undefined) updates.packaging_cost = packaging_cost;
    if (price !== undefined) updates.price = price;

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
