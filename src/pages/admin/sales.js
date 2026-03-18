import { useEffect, useState } from 'react';
import AdminLayout from './layout';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product_id: '', sale_price: '', quantity: 1, ml_order_id: '' });
  const [saving, setSaving] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => { 
    loadData(); 
  }, []);

  async function loadData() {
    try {
      const productsRes = await fetch('/api/admin/products');
      const salesRes = await fetch('/api/admin/sales');
      
      const productsData = await productsRes.json();
      const salesData = await salesRes.json();
      
      setProducts(Array.isArray(productsData) ? productsData : []);
      setSales(Array.isArray(salesData) ? salesData : []);
    } catch (e) {
      console.error('Error:', e);
    }
    setLoading(false);
  }

  const filteredProducts = products.filter(p => 
    productSearch === '' || 
    p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.id?.toLowerCase().includes(productSearch.toLowerCase())
  );

  function selectProduct(product) {
    setForm({ 
      ...form, 
      product_id: product.id,
      sale_price: product.price || ''
    });
    setProductSearch(product.name);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    
    const res = await fetch('/api/admin/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: form.product_id,
        sale_price: parseFloat(form.sale_price),
        quantity: parseInt(form.quantity),
        ml_order_id: form.ml_order_id,
      }),
    });

    if (res.ok) {
      loadData();
      setShowForm(false);
      setForm({ product_id: '', sale_price: '', quantity: 1, ml_order_id: '' });
      setProductSearch('');
    }
    setSaving(false);
  }

  async function deleteSale(id) {
    if (!confirm('¿Eliminar esta venta?')) return;
    await fetch(`/api/admin/sales/${id}`, { method: 'DELETE' });
    setSales(prev => prev.filter(s => s.id !== id));
  }

  function startEdit(sale) {
    setEditingId(sale.id);
    setForm({
      product_id: sale.product_id || '',
      sale_price: sale.sale_price || '',
      quantity: sale.quantity || 1,
      ml_order_id: sale.ml_order_id || ''
    });
    const product = products.find(p => p.id === sale.product_id);
    setProductSearch(product?.name || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ product_id: '', sale_price: '', quantity: 1, ml_order_id: '' });
    setProductSearch('');
  }

  async function saveEdit(saleId) {
    setSaving(true);
    await fetch(`/api/admin/sales/${saleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product_id: form.product_id,
        sale_price: parseFloat(form.sale_price),
        quantity: parseInt(form.quantity),
        ml_order_id: form.ml_order_id,
      }),
    });
    loadData();
    setEditingId(null);
    setSaving(false);
  }

  async function syncFromML() {
    setSyncing(true);
    setNotification(null);
    try {
      const refreshRes = await fetch('/api/admin/ml/refresh-token');
      const refreshData = await refreshRes.json();
      
      if (!refreshRes.ok) {
        setNotification({ type: 'error', message: 'Error al refrescar token de ML. Necesitás reconectar.' });
        setSyncing(false);
        return;
      }

      const res = await fetch('/api/admin/ml/debug');
      const data = await res.json();
      const orders = data.ordersInfo?.results || [];
      
      if (!orders.length) {
        setNotification({ type: 'warning', message: 'No se encontraron órdenes para importar.' });
        setSyncing(false);
        return;
      }
      
      const importRes = await fetch('/api/admin/ml/import-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      });
      
      const importData = await importRes.json();
      
      if (importData.imported > 0) {
        setNotification({ type: 'success', message: `Importadas: ${importData.imported}, Matcheadas: ${importData.matched}, Omitidas: ${importData.skipped}` });
        loadData();
      } else {
        setNotification({ type: 'warning', message: `Sin ventas nuevas. Omitidas: ${importData.skipped}` });
      }
    } catch (e) {
      setNotification({ type: 'error', message: 'Error: ' + e.message });
    }
    setSyncing(false);
  }

  const totalRevenue = Array.isArray(sales) ? sales.reduce((sum, s) => sum + (s.calculated_net || s.net_received || 0), 0) : 0;
  const totalProfit = Array.isArray(sales) ? sales.reduce((sum, s) => sum + (s.calculated_profit || s.profit || 0), 0) : 0;

  const filteredSales = sales.filter(s => {
    if (dateFilter === 'all') return true;
    const saleDate = s.sale_date ? new Date(s.sale_date) : new Date(s.created_at);
    const now = new Date();
    if (dateFilter === 'today') {
      return saleDate.toDateString() === now.toDateString();
    }
    if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return saleDate >= weekAgo;
    }
    if (dateFilter === 'month') {
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    }
    return true;
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
      {notification && (
        <div style={{ 
          padding: '0.75rem 1rem', 
          borderRadius: '0.5rem', 
          marginBottom: '1rem',
          backgroundColor: notification.type === 'success' ? '#10b98120' : notification.type === 'error' ? '#ef444420' : '#f59e0b20',
          border: `1px solid ${notification.type === 'success' ? '#10b981' : notification.type === 'error' ? '#ef4444' : '#f59e0b'}`,
          color: notification.type === 'success' ? '#10b981' : notification.type === 'error' ? '#ef4444' : '#f59e0b',
          fontSize: '0.875rem'
        }}>
          {notification.message}
        </div>
      )}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.125rem' }}>Ventas</h1>
          <p style={{ color: '#71717a', fontSize: '0.875rem' }}>Gestión de ventas</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #3f3f5a', backgroundColor: '#1a1a2e', color: '#fff', fontSize: '0.875rem' }}>
            <option value="all">Todas</option>
            <option value="today">Hoy</option>
            <option value="week">Última semana</option>
            <option value="month">Este mes</option>
          </select>
          <button onClick={syncFromML} disabled={syncing} style={{ padding: '0.5rem 1rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', fontSize: '0.875rem', cursor: syncing ? 'not-allowed' : 'pointer', opacity: syncing ? 0.7 : 1 }}>
            {syncing ? '⏳ Sync...' : '🔄 Sync Mercadolibre'}
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.5rem 1rem', backgroundColor: '#f472b6', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
            {showForm ? '✕ Cancelar' : '+ Nueva Venta'}
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #2a2a3e', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff', marginBottom: '0.75rem' }}>Registrar Venta</h2>
          
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.375rem' }}>Buscar Producto</label>
            <input 
              type="text" 
              value={productSearch} 
              onChange={(e) => {
                setProductSearch(e.target.value);
                if (!e.target.value) setForm({ ...form, product_id: '', sale_price: '' });
              }}
              placeholder="Escribí el nombre o código del producto..."
              style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', fontSize: '0.875rem' }}
            />
{productSearch && filteredProducts.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#1a1a2e', border: '1px solid #3f3f5a', borderRadius: '0.375rem', maxHeight: '200px', overflowY: 'auto', zIndex: 10, marginTop: '0.25rem' }}>
                {filteredProducts.slice(0, 8).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProduct(p)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem', textAlign: 'left', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #2a2a3e', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {p.image && Array.isArray(p.image) && p.image[0] && (
                      <img src={p.image[0]} alt="" style={{ width: '32px', height: '32px', borderRadius: '0.375rem', objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#71717a' }}>{p.id}</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#10b981' }}>${(p.price || 0).toLocaleString('es-AR')}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {form.product_id && (() => {
            const selectedProduct = products.find(p => p.id === form.product_id);
            return selectedProduct ? (
              <div style={{ marginBottom: '0.75rem', padding: '0.5rem', backgroundColor: '#10b98120', borderRadius: '0.375rem', border: '1px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {selectedProduct.image && Array.isArray(selectedProduct.image) && selectedProduct.image[0] && (
                      <img src={selectedProduct.image[0]} alt="" style={{ width: '32px', height: '32px', borderRadius: '0.375rem', objectFit: 'cover' }} />
                    )}
                    <div>
                      <div style={{ color: '#fff', fontWeight: '500', fontSize: '0.875rem' }}>{selectedProduct.name}</div>
                      <div style={{ fontSize: '0.7rem', color: '#71717a' }}>{selectedProduct.id}</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setForm({ ...form, product_id: '', sale_price: '' }); setProductSearch(''); }} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.7rem' }}>Cambiar</button>
                </div>
              </div>
            ) : null;
          })()}

          <form onSubmit={(e) => {
    if (!form.product_id) {
      e.preventDefault();
      alert('Por favor seleccioná un producto');
      return;
    }
    handleSubmit(e);
  }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.375rem' }}>Precio de Venta</label>
              <input type="number" required value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', fontSize: '0.875rem' }} placeholder="Ej: 15000" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.375rem' }}>Cantidad</label>
              <input type="number" required min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', fontSize: '0.875rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '0.375rem' }}>ID Orden ML</label>
              <input type="text" value={form.ml_order_id} onChange={(e) => setForm({ ...form, ml_order_id: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', fontSize: '0.875rem' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" disabled={saving} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#f472b6', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer' }}>
                {saving ? 'Guardando...' : 'Guardar Venta'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Total Ventas</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>{filteredSales.length}</div>
        </div>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Ingresos Netos</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22d3ee' }}>${totalRevenue.toLocaleString('es-AR')}</div>
        </div>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Ganancia Total</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: totalProfit >= 0 ? '#10b981' : '#ef4444' }}>${totalProfit.toLocaleString('es-AR')}</div>
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', border: '1px solid #2a2a3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#161625' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fecha</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Producto</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Precio</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Costo</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Packaging</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Comisión ML</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Neto</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ganancia</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => {
              const isEditing = editingId === sale.id;
              return (
                <tr key={sale.id} style={{ borderTop: '1px solid #2a2a3e' }}>
                  <td style={{ padding: '1rem', color: '#a1a1aa' }}>{sale.sale_date ? new Date(sale.sale_date).toLocaleDateString('es-AR') : '—'}</td>
                  <td style={{ padding: '1rem' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input 
                          type="text" 
                          value={productSearch} 
                          onChange={(e) => {
                            setProductSearch(e.target.value);
                            if (!e.target.value) setForm({ ...form, product_id: '' });
                          }}
                          placeholder="Buscar producto..."
                          style={{ padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', fontSize: '0.75rem' }}
                        />
                        {productSearch && filteredProducts.slice(0, 3).map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => { setForm({ ...form, product_id: p.id }); setProductSearch(p.name); }}
                            style={{ padding: '0.25rem', textAlign: 'left', backgroundColor: '#2a2a3e', border: 'none', borderRadius: '0.25rem', color: '#fff', cursor: 'pointer', fontSize: '0.7rem' }}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#fff' }}>{sale.productName || '—'}</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#a1a1aa' }}>
                    {isEditing ? (
                      <input 
                        type="number" 
                        value={form.sale_price} 
                        onChange={(e) => setForm({ ...form, sale_price: e.target.value })}
                        style={{ width: '80px', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', textAlign: 'right' }}
                      />
                    ) : (
                      `$${(sale.sale_price || 0).toLocaleString('es-AR')}`
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#ef4444' }}>-${(sale.product_cost || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#ef4444' }}>-${(sale.packaging_cost || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#f59e0b' }}>-${(sale.calculated_ml_fees || sale.ml_fees || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#fff' }}>${(sale.calculated_net || sale.net_received || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: (sale.calculated_profit || sale.profit || 0) >= 0 ? '#10b981' : '#ef4444' }}>${(sale.calculated_profit || sale.profit || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => saveEdit(sale.id)} disabled={saving} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>✓</button>
                        <button onClick={cancelEdit} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#3f3f5a', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>✕</button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(sale)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginRight: '0.5rem' }}>✏️</button>
                    )}
                    <button onClick={() => deleteSale(sale.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredSales.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#71717a' }}>No hay ventas registradas</div>
        )}
      </div>
    </AdminLayout>
  );
}
