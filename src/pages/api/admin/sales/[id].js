// pages/api/admin/sales/[id].js
import { supabase } from '../../../../lib/supabase';

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (method === 'PUT') {
    const { product_id, sale_price, quantity, ml_order_id } = req.body;
    
    const { data: product } = await supabase
      .from('products')
      .select('cost, packaging_cost')
      .eq('id', product_id)
      .single();

    const cost = product?.cost || 0;
    const packagingCost = product?.packaging_cost || 1000;
    const mlFees = sale_price * 0.34;
    const netReceived = sale_price - mlFees;
    const profit = netReceived - cost - packagingCost;

    const { error } = await supabase
      .from('sales')
      .update({
        product_id,
        sale_price,
        quantity,
        ml_order_id,
        ml_fees: mlFees,
        net_received: netReceived,
        profit: profit * quantity,
      })
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  if (method === 'DELETE') {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
