// pages/api/admin/ml/sync-sales.js
import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;
  
  if (req.method === 'POST') {
    try {
      // Get tokens from DB
      const { data: tokenData } = await supabaseAdmin
        .from('settings')
        .select('value')
        .eq('key', 'ml_access_token')
        .single();

      const accessToken = tokenData?.value;
      if (!accessToken) {
        return res.status(401).json({ error: 'No hay token de acceso' });
      }

      // Get user_id
      const { data: userIdData } = await supabaseAdmin
        .from('settings')
        .select('value')
        .eq('key', 'ml_user_id')
        .single();

      const userId = userIdData?.value;
      if (!userId) {
        return res.status(400).json({ error: 'No hay user_id' });
      }

      // Get orders - same as debug
      const ordersRes = await fetch(`https://api.mercadolibre.com/orders/search?seller=${userId}&limit=100`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!ordersRes.ok) {
        return res.status(500).json({ error: 'Error al obtener pedidos', status: ordersRes.status });
      }

      const ordersData = await ordersRes.json();
      const orders = ordersData.results || [];

      // Get products
      const { data: products } = await supabaseAdmin.from('products').select('id, name');
      const productMap = {};
      products?.forEach(p => { productMap[p.name.toLowerCase()] = p.id; });

      let imported = 0;
      let skipped = 0;

      for (const order of orders) {
        if (order.status !== 'paid') continue;

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
        const productTitle = orderItem?.item?.title || '';
        
        let matchedProductId = null;
        for (const [name, id] of Object.entries(productMap)) {
          if (productTitle.toLowerCase().includes(name)) {
            matchedProductId = id;
            break;
          }
        }

        await supabaseAdmin.from('sales').insert({
          product_id: matchedProductId || 'unknown',
          sale_price: totalAmount,
          quantity: orderItem?.quantity || 1,
          ml_order_id: order.id.toString(),
          ml_fees: mlFees,
          net_received: netReceived,
          profit: profit,
        });

        imported++;
      }

      return res.status(200).json({
        success: true,
        imported,
        skipped,
        total: orders.length
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end();
}
