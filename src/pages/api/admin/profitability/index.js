// pages/api/admin/profitability/index.js
import { supabase } from '../../../../lib/supabase';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { timeFilter } = req.query;
    
    const [productsRes, salesRes] = await Promise.all([
      supabase.from('products').select('id, name, price, cost, packaging_cost'),
      supabase.from('sales').select('*').order('created_at', { ascending: false }),
    ]);

    let sales = salesRes.data || [];
    
    if (timeFilter && timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      if (timeFilter === '7d') filterDate.setDate(now.getDate() - 7);
      if (timeFilter === '30d') filterDate.setDate(now.getDate() - 30);
      if (timeFilter === '90d') filterDate.setDate(now.getDate() - 90);
      sales = sales.filter(s => new Date(s.created_at) >= filterDate);
    }

    const profitability = calculateProfitability(productsRes.data || [], sales);
    
    const totalRevenue = sales.reduce((sum, s) => sum + (s.net_received || 0), 0);
    const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
    const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const totalUnits = sales.reduce((sum, s) => sum + (s.quantity || 1), 0);

    return res.status(200).json({
      summary: {
        totalRevenue,
        totalProfit,
        avgMargin,
        totalUnits,
        totalSales: sales.length,
      },
      products: profitability,
    });
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${method} Not Allowed`);
}

function calculateProfitability(products, sales) {
  const productStats = {};
  
  sales.forEach(sale => {
    const product = products.find(p => p.id === sale.product_id);
    const productId = sale.product_id;
    
    if (!productStats[productId]) {
      productStats[productId] = { 
        id: productId, 
        title: product?.name || 'Sin nombre', 
        sales: 0, 
        revenue: 0, 
        costs: 0, 
        profit: 0 
      };
    }
    
    const cost = product?.cost || 0;
    const packaging = product?.packaging_cost || 1000;
    const netReceived = sale.net_received || (sale.sale_price * 0.66);
    
    productStats[productId].sales += sale.quantity || 1;
    productStats[productId].revenue += netReceived;
    productStats[productId].costs += (cost + packaging) * (sale.quantity || 1);
    productStats[productId].profit += sale.profit || (netReceived - cost - packaging);
  });

  return Object.values(productStats)
    .map(p => ({ ...p, margin: p.revenue > 0 ? (p.profit / p.revenue) * 100 : 0 }))
    .sort((a, b) => b.profit - a.profit);
}
