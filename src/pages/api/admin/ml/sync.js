// pages/api/admin/ml/sync.js
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

  if (!refreshToken?.value) {
    return null;
  }

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
  const { method } = req;

  if (method === 'POST') {
    // Get access token
    const { data: tokenData } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'ml_access_token')
      .single();

    const { data: userIdData } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'ml_user_id')
      .single();

    const userId = userIdData?.value;

    let accessToken = tokenData?.value;

    if (!accessToken) {
      accessToken = await getMLToken();
      if (!accessToken) {
        return res.status(401).json({ error: 'No hay token de acceso. Autorizá primero en /api/admin/ml/auth' });
      }
    }

    if (!userId) {
      return res.status(400).json({ error: 'No hay user_id. Volvé a autorizar.' });
    }

    // Get orders from ML - try different statuses
    let orders = [];
    const statuses = ['paid', 'approved', 'invoiced'];
    
    for (const status of statuses) {
      const ordersResponse = await fetch(`https://api.mercadolibre.com/orders/search?seller=${userId}&status=${status}&limit=100`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        orders = [...orders, ...(ordersData.results || [])];
      }
    }
    
    // Also try orders_v2 endpoint
    const ordersV2Response = await fetch(`https://api.mercadolibre.com/orders/search?seller=${userId}&limit=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (ordersV2Response.ok) {
      const ordersV2Data = await ordersV2Response.json();
      const newOrders = ordersV2Data.results || [];
      // Merge, avoiding duplicates
      const existingIds = new Set(orders.map(o => o.id));
      newOrders.forEach(o => {
        if (!existingIds.has(o.id)) {
          orders.push(o);
        }
      });
    }

    return res.status(200).json({
      debug: true,
      ordersCount: orders.length,
      orders: orders.slice(0, 3).map(o => ({ id: o.id, status: o.status, total: o.total_amount })),
      totalInML: 1403
    });

    // Get products to match
    const { data: products } = await supabaseAdmin.from('products').select('id, name');
    const productMap = {};
    products?.forEach(p => { productMap[p.name.toLowerCase()] = p.id; });

    let imported = 0;
    let skipped = 0;
    let errors = [];

    for (const order of orders) {
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
      const orderResponse = await fetch(`https://api.mercadolibre.com/orders/${order.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const orderDetail = await orderResponse.json();

      const totalAmount = orderDetail.total_amount || 0;
      const mlFees = totalAmount * 0.34;
      const netReceived = totalAmount - mlFees;
      const profit = netReceived - 1000; // Default packaging

      // Try to match product by title
      const orderItem = orderDetail.order_items?.[0];
      const productTitle = orderItem?.item?.title || '';
      let matchedProductId = null;
      
      for (const [name, id] of Object.entries(productMap)) {
        if (productTitle.toLowerCase().includes(name)) {
          matchedProductId = id;
          break;
        }
      }

      // Insert sale
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
      totalOrders: orders.length,
      errors: errors.slice(0, 5)
    });
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
