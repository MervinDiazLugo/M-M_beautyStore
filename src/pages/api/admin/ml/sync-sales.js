// pages/api/admin/ml/sync-sales.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function getMLToken() {
  const { data: refreshToken } = await supabaseAdmin
    .from('settings')
    .select('value')
    .eq('key', 'ml_refresh_token')
    .single();

  if (!refreshToken?.value) return null;

  const CLIENT_ID = process.env.MERCADOLIBRE_CLIENT_ID;
  const CLIENT_SECRET = process.env.MERCADOLIBRE_CLIENT_SECRET;

  const response = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken.value,
    }),
  });

  const data = await response.json();
  if (data.access_token) {
    await supabaseAdmin.from('settings').upsert({ key: 'ml_access_token', value: data.access_token }, { onConflict: 'key' });
    await supabaseAdmin.from('settings').upsert({ key: 'ml_refresh_token', value: data.refresh_token }, { onConflict: 'key' });
    return data.access_token;
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { data: tokenData } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'ml_access_token')
      .single();

    let accessToken = tokenData?.value;
    if (!accessToken) {
      accessToken = await getMLToken();
      if (!accessToken) {
        return res.status(401).json({ error: 'No hay token de acceso' });
      }
    }

    const { data: userIdData } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'ml_user_id')
      .single();

    const userId = userIdData?.value;
    if (!userId) {
      return res.status(400).json({ error: 'No hay user_id' });
    }

    // Get all orders
    const ordersRes = await fetch(`https://api.mercadolibre.com/orders/search?seller=${userId}&limit=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!ordersRes.ok) {
      return res.status(500).json({ error: 'Error al obtener pedidos de ML' });
    }

    const ordersData = await ordersRes.json();
    const orders = ordersData.results || [];

    // Get products
    const { data: products } = await supabaseAdmin.from('products').select('id, name');
    const productMap = {};
    products?.forEach(p => { productMap[p.name.toLowerCase()] = p.id; });

    let imported = 0;
    let skipped = 0;
    let errors = [];

    for (const order of orders) {
      // Only process paid orders
      if (order.status !== 'paid') continue;

      // Check if already imported
      const { data: existing } = await supabaseAdmin
        .from('sales')
        .select('id')
        .eq('ml_order_id', order.id.toString())
        .single();

      if (existing) {
        skipped++;
        continue;
      }

      // Get order details
      const orderRes = await fetch(`https://api.mercadolibre.com/orders/${order.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const orderDetail = await orderRes.json();

      const totalAmount = orderDetail.total_amount || 0;
      const mlFees = totalAmount * 0.34;
      const netReceived = totalAmount - mlFees;
      const profit = netReceived - 1000;

      const orderItem = orderDetail.order_items?.[0];
      const productTitle = orderItem?.item?.title || '';
      
      let matchedProductId = null;
      for (const [name, id] of Object.entries(productMap)) {
        if (productTitle.toLowerCase().includes(name)) {
          matchedProductId = id;
          break;
        }
      }

      const insertResult = await supabaseAdmin.from('sales').insert({
        product_id: matchedProductId || 'unknown',
        sale_price: totalAmount,
        quantity: orderItem?.quantity || 1,
        ml_order_id: order.id.toString(),
        ml_fees: mlFees,
        net_received: netReceived,
        profit: profit,
      });

      if (insertResult.error) {
        errors.push({ orderId: order.id, error: insertResult.error.message });
      } else {
        imported++;
      }
    }

    return res.status(200).json({
      success: true,
      imported,
      skipped,
      totalProcessed: orders.length,
      errors: errors.slice(0, 5)
    });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end();
}
