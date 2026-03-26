// pages/api/admin/profitability/index.js
import { supabase, DEFAULT_PACKAGING_COST } from '../../../../lib/supabase';
import { validateApiKey } from '../../../../lib/apiAuth';

export default async function handler(req, res) {
  if (!validateApiKey(req, res)) return;
  
  const { method } = req;

  if (method === 'GET') {
    const { timeFilter, year, month } = req.query;
    
    const [productsRes, salesRes] = await Promise.all([
      supabase.from('products').select('id, name, price, ml_price, cost, packaging_cost, mercado_libre_url, ml_item_id'),
      supabase.from('sales').select('*').order('created_at', { ascending: false }),
    ]);

    let sales = salesRes.data || [];
    
    if (year && month) {
      const targetYear = parseInt(year);
      const targetMonth = parseInt(month);
      sales = sales.filter(s => {
        const saleDate = new Date(s.sale_date || s.created_at);
        return saleDate.getFullYear() === targetYear && saleDate.getMonth() + 1 === targetMonth;
      });
    } else if (timeFilter && timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      if (timeFilter === '7d') filterDate.setDate(now.getDate() - 7);
      if (timeFilter === '30d') filterDate.setDate(now.getDate() - 30);
      if (timeFilter === '90d') filterDate.setDate(now.getDate() - 90);
      sales = sales.filter(s => new Date(s.sale_date || s.created_at) >= filterDate);
    }

    let mlChargesData = null;
    let additionalMlCharges = 0;
    let actualMlFees = 0;
    if (year && month) {
      const { data: mlCharges } = await supabase
        .from('ml_monthly_charges')
        .select('total_charges, total_bonuses, charges')
        .eq('year', parseInt(year))
        .eq('month', parseInt(month))
        .single();
      
      if (mlCharges && mlCharges.charges) {
        const commissionTypes = ['CVFV', 'CVFN', 'CVFF'];
        const commissionCharges = mlCharges.charges.filter(c => commissionTypes.includes(c.type));
        actualMlFees = commissionCharges.reduce((sum, c) => sum + (c.amount || 0), 0);
        
        const extraCharges = mlCharges.charges.filter(c => !commissionTypes.includes(c.type));
        additionalMlCharges = extraCharges.reduce((sum, c) => sum + (c.amount || 0), 0) - (mlCharges.total_bonuses || 0);
        
        mlChargesData = {
          total: additionalMlCharges,
          charges: mlCharges.charges,
          bonuses: mlCharges.total_bonuses || 0,
          extraCharges,
          actualCommission: actualMlFees,
        };
      }
    }

    const profitability = calculateProfitability(productsRes.data || [], sales);
    
    const totalRevenue = sales.reduce((sum, s) => sum + (s.sale_price || 0), 0);
    const totalMlFees = actualMlFees > 0 ? actualMlFees : profitability.reduce((sum, p) => sum + (p.mlFeesTotal || 0), 0);
    const totalProductCosts = profitability.reduce((sum, p) => sum + (p.costs || 0), 0);
    
    const totalProfit = (totalRevenue - totalMlFees - totalProductCosts) - additionalMlCharges;
    const avgMargin = totalRevenue > 0 ? ((totalRevenue - totalMlFees - totalProductCosts - additionalMlCharges) / totalRevenue) * 100 : 0;
    const totalUnits = sales.reduce((sum, s) => sum + (s.quantity || 1), 0);

    return res.status(200).json({
      summary: {
        totalRevenue,
        totalProfit,
        avgMargin,
        totalUnits,
        totalSales: sales.length,
        mlFees: totalMlFees,
        productCosts: totalProductCosts,
        mlCharges: additionalMlCharges,
        mlChargesData,
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
    
    const salePrice = sale.sale_price || 0;
    const quantity = sale.quantity || 1;
    const productCost = product?.cost || 0;
    const packagingCost = product?.packaging_cost || DEFAULT_PACKAGING_COST;
    
    const mlFees = salePrice * 0.34;
    const netReceived = salePrice - mlFees;
    const profit = netReceived - (productCost * quantity) - (packagingCost * quantity);
    
    if (!productStats[productId]) {
      productStats[productId] = { 
        id: productId, 
        title: product?.name || 'Sin nombre', 
        sales: 0, 
        revenue: 0, 
        totalCosts: 0,
        mlFeesTotal: 0,
        costs: 0, 
        profit: 0,
        cost: product?.cost || 0,
        packaging: product?.packaging_cost || DEFAULT_PACKAGING_COST,
        mercado_libre_url: product?.mercado_libre_url || null,
        ml_item_id: product?.ml_item_id || null,
        ml_price: product?.ml_price || 0,
      };
    }
    
    productStats[productId].sales += quantity;
    productStats[productId].revenue += salePrice;
    productStats[productId].mlFeesTotal += mlFees;
    productStats[productId].costs += (productCost + packagingCost) * quantity;
    productStats[productId].profit += profit;
  });

  return Object.values(productStats)
    .map(p => {
      const margin = p.revenue > 0 ? (p.profit / p.revenue) * 100 : 0;
      const projectedProfit = p.ml_price - (p.ml_price * 0.34) - p.cost - p.packaging;
      const projectedMargin = p.ml_price > 0 ? (projectedProfit / p.ml_price) * 100 : 0;
      return { ...p, margin, projectedMargin };
    })
    .sort((a, b) => b.profit - a.profit);
}
