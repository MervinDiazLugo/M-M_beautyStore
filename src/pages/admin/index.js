import { useState, useEffect } from 'react';
import AdminLayout from './layout';
import { adminFetch } from '../../lib/adminApi';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    productsWithCost: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const [productsRes, salesRes] = await Promise.all([
      adminFetch('/api/admin/products').then(r => r.json()),
      adminFetch('/api/admin/sales').then(r => r.json()),
    ]);

    const products = productsRes || [];
    const sales = salesRes || [];

    const totalProducts = products.length;
    const productsWithCost = products.filter(p => p.cost && p.cost > 0).length;
    const totalSales = sales.length;
    
    let totalRevenue = 0;
    let totalProfit = 0;

    sales.forEach(sale => {
      const mlFee = sale.sale_price * 0.34;
      const net = sale.sale_price - mlFee;
      const product = products.find(p => p.id === sale.product_id);
      const cost = product?.cost || 0;
      const packaging = product?.packaging_cost || 1000;
      totalRevenue += net;
      totalProfit += net - cost - packaging;
    });

    setStats({ totalProducts, productsWithCost, totalSales, totalRevenue, totalProfit });
    setLoading(false);
  }

  const cards = [
    { label: 'Productos', value: stats.totalProducts, sub: 'en tu catálogo', icon: '💄', color: '#8b5cf6' },
    { label: 'Con Costo', value: stats.productsWithCost, sub: 'configurado', icon: '✅', color: '#10b981' },
    { label: 'Ventas', value: stats.totalSales, sub: 'registradas', icon: '🛍️', color: '#f472b6' },
    { label: 'Ingresos', value: `$${(stats.totalRevenue/1000).toFixed(1)}k`, sub: 'neto recibido', icon: '💵', color: '#22d3ee' },
    { label: 'Ganancia', value: `$${(stats.totalProfit/1000).toFixed(1)}k`, sub: 'total', icon: '📈', color: stats.totalProfit >= 0 ? '#10b981' : '#ef4444' },
  ];

  const quickActions = [
    { title: 'Agregar Costos', desc: 'Define el costo de cada producto', icon: '🏷️', href: '/admin/products', color: '#8b5cf6' },
    { title: 'Registrar Venta', desc: 'Registra una nueva venta', icon: '➕', href: '/admin/sales', color: '#f472b6' },
    { title: 'Ver Análisis', desc: 'Mira tu rentabilidad', icon: '📊', href: '/admin/profitability', color: '#22d3ee' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #2a2a3e', borderTopColor: '#f472b6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <span style={{ color: '#a1a1aa' }}>Cargando datos...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: '#71717a' }}>Resumen de tu negocio M&M Beauty</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {cards.map((card, i) => (
          <div key={i} style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #2a2a3e' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: card.color }}></div>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '0.875rem', color: '#a1a1aa', marginTop: '0.25rem' }}>{card.label}</div>
            <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '2rem', border: '1px solid #2a2a3e' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '1.5rem' }}>Acciones Rápidas</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {quickActions.map((action, i) => (
            <a key={i} href={action.href} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', backgroundColor: '#161625', borderRadius: '0.75rem', textDecoration: 'none', border: '1px solid #2a2a3e', transition: 'all 0.2s' }}>
              <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.75rem', backgroundColor: action.color + '20', fontSize: '1.5rem' }}>
                {action.icon}
              </div>
              <div>
                <div style={{ fontWeight: '600', color: '#fff', marginBottom: '0.25rem' }}>{action.title}</div>
                <div style={{ fontSize: '0.875rem', color: '#71717a' }}>{action.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        a:hover { transform: translateY(-2px); }
      `}</style>
    </AdminLayout>
  );
}
