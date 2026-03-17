// pages/api/admin/ml/import-sales.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

function findMatchingProduct(productTitle, products) {
  if (!productTitle || !products) return null;
  
  const titleLower = productTitle.toLowerCase();
  
  // Direct match
  for (const p of products) {
    if (p.name && titleLower.includes(p.name.toLowerCase())) {
      return p.id;
    }
  }
  
  // Partial match - extract key words
  const words = titleLower.split(/[\s\-_]+/).filter(w => w.length > 3);
  for (const word of words) {
    for (const p of products) {
      if (p.name && p.name.toLowerCase().includes(word)) {
        return p.id;
      }
    }
  }
  
  return null;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { orders } = req.body;
      
      if (!orders || !Array.isArray(orders)) {
        return res.status(400).json({ error: 'orders es requerido', received: typeof orders });
      }

      // Get all products
      const { data: products } = await supabaseAdmin.from('products').select('id, name');

      let imported = 0;
      let skipped = 0;
      let matched = 0;
      let notPaid = 0;

      for (const order of orders) {
        if (order.status !== 'paid') {
          notPaid++;
          continue;
        }

        // Check if already exists
        const { data: existing } = await supabaseAdmin
          .from('sales')
          .select('id')
          .eq('ml_order_id', order.id.toString())
          .single();

        if (existing) {
          skipped++;
          continue;
        }

        const totalAmount = order.total_amount || 0;
        const mlFees = totalAmount * 0.34;
        const netReceived = totalAmount - mlFees;
        const profit = netReceived - 1000;

        const orderItem = order.order_items?.[0];
        const quantity = orderItem?.quantity || 1;
        const productTitle = orderItem?.item?.title || '';

        // Try to match product
        const matchedProductId = findMatchingProduct(productTitle, products);
        if (matchedProductId) matched++;

        await supabaseAdmin.from('sales').insert({
          product_id: matchedProductId || 'unknown',
          sale_price: totalAmount,
          quantity,
          ml_order_id: order.id.toString(),
          ml_fees: mlFees,
          net_received: netReceived,
          profit: profit,
        });

        imported++;
      }

      return res.status(200).json({ success: true, imported, skipped, matched });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end();
}
