import { useEffect, useState } from 'react';
import AdminLayout from './layout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminFetch } from '../../lib/adminApi';

export default function Profitability() {
  const [data, setData] = useState({ summary: {}, products: [] });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('30d');
  const [filterMonth, setFilterMonth] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'profit', dir: 'desc' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { loadData(); }, [timeFilter, filterMonth]);

  function handleSort(key) {
    setSortConfig(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  }

  async function loadData() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterMonth) {
      const [year, month] = filterMonth.split('-');
      params.set('year', year);
      params.set('month', month);
    } else {
      params.set('timeFilter', timeFilter);
    }
    const res = await adminFetch(`/api/admin/profitability?${params.toString()}`);
    const result = await res.json();
    setData(result || { summary: {}, products: [] });
    setLoading(false);
  }

  const { summary = {}, products: profitability = [] } = data;
  const totalRevenue = summary.totalRevenue || 0;
  const totalProfit = summary.totalProfit || 0;
  const avgMargin = summary.avgMargin || 0;
  const totalUnits = summary.totalUnits || 0;
  const pieColors = ['#f472b6', '#8b5cf6', '#22d3ee', '#10b981', '#f59e0b', '#ef4444'];
  const topProducts = profitability.slice(0, 5);
  const chartData = topProducts.map(p => ({ name: p.title.substring(0, 15) + (p.title.length > 15 ? '...' : ''), ganancia: p.profit, mlFees: p.mlFeesTotal, costos: p.costs }));

  const sortedProducts = [...profitability].sort((a, b) => {
    let aVal, bVal;
    switch (sortConfig.key) {
      case 'title':
        aVal = a.title || '';
        bVal = b.title || '';
        break;
      case 'sales':
        aVal = a.sales || 0;
        bVal = b.sales || 0;
        break;
      case 'revenue':
        aVal = a.revenue || 0;
        bVal = b.revenue || 0;
        break;
      case 'profit':
        aVal = a.profit || 0;
        bVal = b.profit || 0;
        break;
      default:
        aVal = a[sortConfig.key] || 0;
        bVal = b[sortConfig.key] || 0;
    }
    if (aVal < bVal) return sortConfig.dir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.dir === 'asc' ? 1 : -1;
    return 0;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#a1a1aa' }}>Cargando...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' }}>Rentabilidad</h1>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Analizá tus ganancias por producto</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select value={filterMonth} onChange={(e) => { setFilterMonth(e.target.value); setTimeFilter('30d'); }} style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #3f3f5a', backgroundColor: '#1a1a2e', color: '#fff', fontSize: '0.875rem' }}>
            <option value="">Mes específico</option>
            {Array.from({ length: 12 }, (_, i) => {
              const d = new Date();
              d.setMonth(d.getMonth() - i);
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year = d.getFullYear();
              const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
              return <option key={`${year}-${month}`} value={`${year}-${month}`}>{months[d.getMonth()]} {year}</option>;
            })}
          </select>
          <select value={timeFilter} onChange={(e) => { setTimeFilter(e.target.value); setFilterMonth(''); }} style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #3f3f5a', backgroundColor: '#1a1a2e', color: '#fff', fontSize: '0.875rem' }}>
            <option value="all">Todo</option>
            <option value="7d">Última semana</option>
            <option value="30d">Este mes</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Total Ventas</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>{summary.totalSales || 0}</div>
        </div>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Ingresos Netos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22d3ee' }}>${totalRevenue.toLocaleString('es-AR')}</div>
        </div>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Comisiones ML</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>${(profitability.reduce((sum, p) => sum + (p.mlFeesTotal || 0), 0)).toLocaleString('es-AR')}</div>
        </div>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Costos Totales</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>${(profitability.reduce((sum, p) => sum + (p.costs || 0), 0)).toLocaleString('es-AR')}</div>
        </div>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Ganancia Total</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: totalProfit >= 0 ? '#10b981' : '#ef4444' }}>${totalProfit.toLocaleString('es-AR')}</div>
        </div>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Margen Promedio</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: avgMargin >= 0 ? '#10b981' : '#ef4444' }}>{avgMargin.toFixed(1)}%</div>
        </div>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Unidades Vendidas</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>{totalUnits}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #2a2a3e' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>Top 5 Productos</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
                <XAxis dataKey="name" tick={{ fill: '#71717a', fontSize: 12 }} />
                <YAxis tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#161625', border: '1px solid #2a2a3e', borderRadius: '0.5rem' }} />
                <Bar dataKey="ganancia" fill="#10b981" name="Ganancia" radius={[4, 4, 0, 0]} />
                <Bar dataKey="mlFees" fill="#f59e0b" name="Comisión ML" radius={[4, 4, 0, 0]} />
                <Bar dataKey="costos" fill="#ef4444" name="Costos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>No hay datos suficientes</div>
          )}
        </div>

        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #2a2a3e' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>Distribución</h2>
          {profitability.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={profitability.slice(0, 6)} dataKey="profit" nameKey="title" cx="50%" cy="50%" outerRadius={80} label={({ title, percent }) => `${title.substring(0, 10)} ${(percent * 100).toFixed(0)}%`}>
                  {profitability.slice(0, 6).map((entry, index) => <Cell key={entry.id} fill={pieColors[index % pieColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#161625', border: '1px solid #2a2a3e', borderRadius: '0.5rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a' }}>No hay datos suficientes</div>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', border: '1px solid #2a2a3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#161625' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Producto</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ventas</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ingresos</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Comisión ML</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Costos</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ganancia</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Margen</th>
            </tr>
          </thead>
          <tbody>
            {profitability.map((item) => (
              <tr key={item.id} style={{ borderTop: '1px solid #2a2a3e' }}>
                <td style={{ padding: '1rem', color: '#fff', fontWeight: '500' }}>{item.title}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: '#a1a1aa' }}>{item.sales}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: '#fff' }}>${item.revenue.toLocaleString('es-AR')}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: '#f59e0b' }}>-${(item.mlFeesTotal || 0).toLocaleString('es-AR')}</td>
                <td style={{ padding: '1rem', textAlign: 'right', color: '#ef4444' }}>-${item.costs.toLocaleString('es-AR')}</td>
                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: item.profit >= 0 ? '#10b981' : '#ef4444' }}>${item.profit.toLocaleString('es-AR')}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: item.margin >= 0 ? '#10b98120' : '#ef444420', color: item.margin >= 0 ? '#10b981' : '#ef4444' }}>
                    {item.margin.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {profitability.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#71717a' }}>No hay datos de rentabilidad</div>
        )}
      </div>
    </AdminLayout>
  );
}
