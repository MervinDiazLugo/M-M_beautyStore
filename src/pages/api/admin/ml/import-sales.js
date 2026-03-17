// pages/api/admin/ml/import-sales.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { orders } = req.body;
      
      if (!orders || !Array.isArray(orders)) {
        return res.status(400).json({ error: 'orders es requerido' });
      }

      let imported = 0;
      let skipped = 0;

      for (const order of orders) {
        if (order.status !== 'paid') continue;

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

        await supabaseAdmin.from('sales').insert({
          product_id: 'unknown',
          sale_price: totalAmount,
          quantity,
          ml_order_id: order.id.toString(),
          ml_fees: mlFees,
          net_received: netReceived,
          profit: profit,
        });

        imported++;
      }

      return res.status(200).json({ success: true, imported, skipped });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end();
}
