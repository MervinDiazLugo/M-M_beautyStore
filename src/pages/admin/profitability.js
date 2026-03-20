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
  const [updateModal, setUpdateModal] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [updating, setUpdating] = useState(false);

  const MIN_MARGIN = 0.20;
  const TARGET_NET = 1 - MIN_MARGIN - 0.34;

  function calculateSuggestedPrice(cost, packaging) {
    return Math.round((cost + packaging) / TARGET_NET);
  }

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

  async function loadProductDetails(productId) {
    const res = await adminFetch(`/api/admin/products/${productId}`);
    const product = await res.json();
    if (product) {
      const suggestedPrice = calculateSuggestedPrice(product.cost || 0, product.packaging_cost || 1000);
      setUpdateModal({
        id: product.id,
        name: product.name,
        currentPrice: product.price,
        cost: product.cost,
        packaging: product.packaging_cost || 1000,
        suggestedPrice,
      });
      setNewPrice(suggestedPrice.toString());
    }
  }

  async function applyPriceUpdate() {
    if (!updateModal || !newPrice) return;
    setUpdating(true);
    try {
      await adminFetch(`/api/admin/products/${updateModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: parseInt(newPrice) }),
      });
      setUpdateModal(null);
      loadData();
    } catch (err) {
      alert('Error al actualizar: ' + err.message);
    }
    setUpdating(false);
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
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ backgroundColor: '#161625' }}>
              <th onClick={() => handleSort('title')} style={{ padding: '0.75rem', textAlign: 'left', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                Producto {sortConfig.key === 'title' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('sales')} style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                Ventas {sortConfig.key === 'sales' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('revenue')} style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                Ingresos {sortConfig.key === 'revenue' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Comisión ML
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Costos
              </th>
              <th onClick={() => handleSort('profit')} style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                Ganancia {sortConfig.key === 'profit' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('margin')} style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                Margen {sortConfig.key === 'margin' && (sortConfig.dir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Precio Sug.
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'center', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}></th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((item) => {
              const margin = item.margin || 0;
              const marginColor = margin < 0 ? '#ef4444' : margin < 20 ? '#f59e0b' : '#10b981';
              const marginBg = margin < 0 ? '#ef444420' : margin < 20 ? '#f59e0b20' : '#10b98120';
              return (
                <tr key={item.id} style={{ borderTop: '1px solid #2a2a3e' }}>
                  <td style={{ padding: '0.75rem', color: '#fff', fontWeight: '500', fontSize: '0.8rem', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>{item.title}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#a1a1aa', fontSize: '0.75rem' }}>{item.sales}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#fff', fontSize: '0.75rem' }}>${item.revenue.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#f59e0b', fontSize: '0.75rem' }}>-${(item.mlFeesTotal || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#ef4444', fontSize: '0.75rem' }}>-${item.costs.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: item.profit >= 0 ? '#10b981' : '#ef4444', fontSize: '0.75rem' }}>${item.profit.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.7rem', fontWeight: '600', backgroundColor: marginBg, color: marginColor }}>
                      {margin.toFixed(1)}%
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#22d3ee', fontSize: '0.75rem' }}>
                    {margin < 20 ? '$—' : '—'}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => loadProductDetails(item.id)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: '#f472b6', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '0.25rem', 
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: '500',
                      }}
                    >
                      {margin < 20 ? 'Ajustar' : 'Ver'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {profitability.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#71717a' }}>No hay datos de rentabilidad</div>
        )}
      </div>

      {updateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #2a2a3e', width: '400px', maxWidth: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>Actualizar Precio</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: '1rem', wordBreak: 'break-word' }}>{updateModal.name}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ backgroundColor: '#161625', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Precio Actual</div>
                <div style={{ fontSize: '1rem', color: '#fff', fontWeight: '600' }}>${(updateModal.currentPrice || 0).toLocaleString('es-AR')}</div>
              </div>
              <div style={{ backgroundColor: '#161625', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Precio Sugerido</div>
                <div style={{ fontSize: '1rem', color: '#22d3ee', fontWeight: '600' }}>${updateModal.suggestedPrice.toLocaleString('es-AR')}</div>
              </div>
              <div style={{ backgroundColor: '#161625', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Costo</div>
                <div style={{ fontSize: '1rem', color: '#ef4444' }}>${(updateModal.cost || 0).toLocaleString('es-AR')}</div>
              </div>
              <div style={{ backgroundColor: '#161625', padding: '0.75rem', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Packaging</div>
                <div style={{ fontSize: '1rem', color: '#ef4444' }}>${(updateModal.packaging || 0).toLocaleString('es-AR')}</div>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Nuevo Precio</label>
              <input 
                type="number" 
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', fontSize: '1rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => setUpdateModal(null)}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#3f3f5a', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancelar
              </button>
              <button 
                onClick={applyPriceUpdate}
                disabled={updating}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: updating ? 'not-allowed' : 'pointer', fontWeight: '600', opacity: updating ? 0.6 : 1 }}
              >
                {updating ? 'Guardando...' : 'Aplicar Precio'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
