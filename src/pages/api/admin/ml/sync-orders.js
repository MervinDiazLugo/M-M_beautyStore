// pages/api/admin/ml/sync-orders.js
import { createClient } from '@supabase/supabase-js';
import { validateApiKey } from '../../../../lib/apiAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

const ML_COMMISSION_RATE = 0.34;
const DEFAULT_PACKAGING_COST = 1000;

function findMatchingProduct(productTitle, products) {
  if (!productTitle || !products) return null;
  
  const titleLower = productTitle.toLowerCase();
  
  for (const p of products) {
    if (p.name && titleLower.includes(p.name.toLowerCase())) {
      return p;
    }
  }
  
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
  
  if (req.method === 'GET') {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ error: 'year y month son requeridos' });
    }

    const tokenResult = await supabaseAdmin
      .from('settings')
      .select('key, value')
      .in('key', ['ml_access_token', 'ml_user_id']);

    const tokenData = tokenResult.data || [];
    const accessToken = tokenData.find(t => t.key === 'ml_access_token')?.value;
    const userId = tokenData.find(t => t.key === 'ml_user_id')?.value;

    if (!accessToken || !userId) {
      return res.status(401).json({ error: 'No conectado a MercadoLibre' });
    }

    const productsResult = await supabaseAdmin.from('products').select('id, name, cost, packaging_cost');
    const products = productsResult.data || [];

    let imported = 0;
    let skipped = 0;
    let matched = 0;
    let notPaid = 0;
    let offset = 0;
    const limit = 50;
    let hasMore = true;
    let totalProcessed = 0;

    try {
      while (hasMore && totalProcessed < 500) {
        const url = `https://api.mercadolibre.com/orders/search?seller=${userId}&limit=${limit}&offset=${offset}&sort=date_desc`;
        
        const mlRes = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!mlRes.ok) {
          const error = await mlRes.json();
          throw new Error(error.message || 'Error al obtener órdenes');
        }

        const data = await mlRes.json();
        const orders = data.results || [];
        
        if (orders.length === 0) {
          hasMore = false;
          break;
        }

        let pageProcessed = false;
        
        for (const order of orders) {
          const orderDate = new Date(order.date_created);
          const orderYear = orderDate.getFullYear();
          const orderMonth = orderDate.getMonth() + 1;
          
          const targetYear = parseInt(year);
          const targetMonth = parseInt(month);
          
          if (orderYear < targetYear || (orderYear === targetYear && orderMonth < targetMonth)) {
            hasMore = false;
            pageProcessed = true;
            break;
          }
          
          if (orderYear > targetYear || (orderYear === targetYear && orderMonth > targetMonth)) {
            pageProcessed = true;
            break;
          }
          
          pageProcessed = true;
          totalProcessed++;
          
          if (order.status !== 'paid') {
            notPaid++;
            continue;
          }

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

          const matchedProduct = findMatchingProduct(productTitle, products);
          const productId = matchedProduct?.id || 'unknown';
          const productCost = matchedProduct?.cost || 0;
          const packagingCost = matchedProduct?.packaging_cost || DEFAULT_PACKAGING_COST;
          
          if (matchedProduct) matched++;

          const unitPrice = orderItem?.sale_price || orderItem?.unit_final_price || order.total_amount / quantity || order.total_amount || 0;
          const totalAmount = unitPrice * quantity;
          const mlFees = totalAmount * ML_COMMISSION_RATE;
          const netReceived = totalAmount - mlFees;
          const profit = netReceived - productCost - packagingCost;

          await supabaseAdmin.from('sales').insert({
            product_id: productId,
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

        if (pageProcessed) {
          offset += limit;
        }
      }

      return res.status(200).json({ 
        imported, 
        skipped, 
        matched,
        notPaid,
        totalProcessed,
        period: `${month}/${year}`
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end();
}
