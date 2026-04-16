// pages/api/admin/ml/import-sales.js
import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';
import { ML_COMMISSION_RATE, DEFAULT_PACKAGING_COST } from '../../../../lib/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

function findMatchingProduct(productTitle, products) {
  if (!productTitle || !products) return null;
  
  const titleLower = productTitle.toLowerCase();
  
  // Direct match
  for (const p of products) {
    if (p.name && titleLower.includes(p.name.toLowerCase())) {
      return p;
    }
  }
  
  // Partial match - extract key words
  const words = titleLower.split(/[\s\-_]+/).filter(w => w.length > 3);
  for (const word of words) {
    for (const p of products) {
      if (p.name && p.name.toLowerCase().includes(word)) {
        return p;
      }
    }
  }
  
  return null;
}

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;
  
  if (req.method === 'POST') {
    try {
      const { orders } = req.body;
      
      if (!orders || !Array.isArray(orders)) {
        return res.status(400).json({ error: 'orders es requerido', received: typeof orders });
      }

      // Get all products with costs
      const { data: products } = await supabaseAdmin.from('products').select('id, name, cost, packaging_cost');

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

        const orderItem = order.order_items?.[0];
        const quantity = orderItem?.quantity || 1;
        const productTitle = orderItem?.item?.title || '';
        const saleDate = order.date_created || null;

        // Try to match product
        const matchedProduct = findMatchingProduct(productTitle, products);
        const matchedProductId = matchedProduct?.id || 'unknown';
        const productCost = matchedProduct?.cost || 0;
        const packagingCost = matchedProduct?.packaging_cost || DEFAULT_PACKAGING_COST;
        
        if (matchedProduct) matched++;

        const totalAmount = order.total_amount || 0;
        const mlFees = totalAmount * ML_COMMISSION_RATE;
        const netReceived = totalAmount - mlFees;
        const profit = netReceived - productCost - packagingCost;

        await supabaseAdmin.from('sales').insert({
          product_id: matchedProductId,
          sale_price: totalAmount,
          quantity,
          ml_order_id: order.id.toString(),
          ml_fees: mlFees,
          net_received: netReceived,
          profit: profit,
          sale_date: saleDate,
          product_cost: productCost,
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
