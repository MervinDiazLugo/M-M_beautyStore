// pages/api/admin/ml/sync-orders.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { year, month } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ error: 'year y month son requeridos' });
    }

    const tokenData = await supabaseAdmin
      .from('settings')
      .select('value')
      .in('key', ['ml_access_token', 'ml_user_id']);

    const accessToken = tokenData?.find(t => t.key === 'ml_access_token')?.value;
    const userId = tokenData?.find(t => t.key === 'ml_user_id')?.value;

    if (!accessToken || !userId) {
      return res.status(401).json({ error: 'No conectado a MercadoLibre' });
    }

    const startDate = `${year}-${String(month).padStart(2, '0')}-01T00:00:00.000-03:00`;
    const endMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
    const endYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
    const endDate = `${endYear}-${String(endMonth).padStart(2, '0')}-01T00:00:00.000-03:00`;

    const orders = [];
    let offset = 0;
    const limit = 50;
    let hasMore = true;
    let totalFetched = 0;

    try {
      while (hasMore && totalFetched < 500) {
        const url = `https://api.mercadolibre.com/orders/search?seller=${userId}&order_date=created_from%3A${encodeURIComponent(startDate)}%3Bcreated_to%3A${encodeURIComponent(endDate)}&limit=${limit}&offset=${offset}`;
        
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Error al obtener órdenes');
        }

        const data = await res.json();
        const results = data.results || [];
        
        if (results.length === 0) {
          hasMore = false;
        } else {
          orders.push(...results);
          offset += limit;
          totalFetched += results.length;
          
          if (results.length < limit) {
            hasMore = false;
          }
        }
      }

      return res.status(200).json({ 
        orders,
        total: orders.length,
        period: `${month}/${year}`
      });

    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end();
}
