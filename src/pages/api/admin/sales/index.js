// pages/api/admin/sales/index.js
import { supabase, calculateProfit, DEFAULT_PACKAGING_COST } from '../../../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    
    // Obtener nombres y costos de productos
    const productIds = [...new Set(data.map(s => s.product_id))];
    const { data: products } = await supabase
      .from('products')
      .select('id, name, cost, packaging_cost')
      .in('id', productIds);
    
    const productMap = {};
    products?.forEach(p => { productMap[p.id] = p; });
    
    const salesWithProducts = data.map(s => {
      const product = productMap[s.product_id];
      const productCost = product?.cost || 0;
      const packagingCost = product?.packaging_cost || DEFAULT_PACKAGING_COST;
      const mlFees = (s.sale_price || 0) * 0.34;
      const netReceived = (s.sale_price || 0) - mlFees;
      const profit = netReceived - productCost - packagingCost;
      
      return {
        ...s,
        productName: product?.name || 'Producto no encontrado',
        product_cost: productCost,
        packaging_cost: packagingCost,
        calculated_profit: profit,
        calculated_ml_fees: mlFees,
        calculated_net: netReceived,
      };
    });
    
    return res.status(200).json(salesWithProducts);
  }

  if (method === 'POST') {
    const { product_id, sale_price, quantity = 1, ml_order_id } = req.body;
    
    if (!product_id || !sale_price) {
      return res.status(400).json({ error: 'product_id y sale_price son requeridos' });
    }

    // Obtener costo del producto
    const { data: product } = await supabase
      .from('products')
      .select('cost, packaging_cost')
      .eq('id', product_id)
      .single();

    const profitData = calculateProfit(
      sale_price,
      product?.cost || 0,
      product?.packaging_cost || DEFAULT_PACKAGING_COST
    );

    const { data, error } = await supabase
      .from('sales')
      .insert({
        product_id,
        sale_price,
        quantity,
        ml_order_id: ml_order_id || null,
        ml_fees: profitData.mlFees,
        net_received: profitData.netReceived,
        profit: profitData.profit * quantity,
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
