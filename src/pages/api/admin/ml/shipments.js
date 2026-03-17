// pages/api/admin/ml/shipments.js
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

  if (method === 'GET') {
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

    // Get shipments in transit
    const response = await fetch(`https://api.mercadolibre.com/shipments/search?seller=${userId}&status=in_transit`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      accessToken = await getMLToken();
      if (!accessToken) {
        return res.status(401).json({ error: 'Token expirado' });
      }
    }

    const data = await response.json();
    const shipments = data.results || [];

    // Get product names for display
    const { data: products } = await supabaseAdmin.from('products').select('id, name');
    const productMap = {};
    products?.forEach(p => { productMap[p.id] = p.name; });

    // Get sales to match orders
    const { data: sales } = await supabaseAdmin.from('sales').select('id, ml_order_id, product_id');
    const salesMap = {};
    sales?.forEach(s => { salesMap[s.ml_order_id] = s; });

    const shipmentsWithDetails = await Promise.all(shipments.map(async (shipment) => {
      const orderId = shipment.order_id;
      
      // Get order details
      const orderResponse = await fetch(`https://api.mercadolibre.com/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const orderDetail = await orderResponse.json();
      
      const orderItem = orderDetail.order_items?.[0];
      const productTitle = orderItem?.item?.title || '';
      const sale = salesMap[orderId?.toString()];
      const productName = productMap[sale?.product_id] || productTitle;

      return {
        id: shipment.id,
        order_id: orderId,
        status: shipment.status,
        product: productName,
        buyer: shipment.receiver_id?.name || '',
        address: shipment.destination?.address?.city || '',
        tracking: shipment.tracking_number || shipment.tracking_method || '',
        date: shipment.date_created,
      };
    }));

    return res.status(200).json({ 
      shipments: shipmentsWithDetails,
      total: shipments.length 
    });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
