// pages/api/admin/products/index.js
import { supabase, ML_COMMISSION_RATE, DEFAULT_PACKAGING_COST } from '../../../../lib/supabase';
import { validateApiKey } from '../../../../lib/apiAuth';

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;

  const { method } = req;

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, price, ml_price, cost, packaging_cost, image, published, mercado_libre_url, ml_item_id')
      .order('name');

    if (error) return res.status(500).json({ error: error.message });

    const enriched = data.map(p => {
      const mlPrice = p.ml_price || 0;
      const cost = p.cost || 0;
      const packagingCost = p.packaging_cost || DEFAULT_PACKAGING_COST;
      const ml_fee = mlPrice * ML_COMMISSION_RATE;
      const net_received = mlPrice - ml_fee;
      const profit = net_received - cost - packagingCost;
      return { ...p, ml_fee, net_received, profit };
    });

    return res.status(200).json(enriched);
  }

  if (method === 'PUT' || method === 'PATCH') {
    const { id, ...updates } = req.body;
    
    if (!id) return res.status(400).json({ error: 'id es requerido' });

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
