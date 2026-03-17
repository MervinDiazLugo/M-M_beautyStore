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

  const totalRevenue = Array.isArray(sales) ? sales.reduce((sum, s) => sum + (s.net_received || 0), 0) : 0;
  const totalProfit = Array.isArray(sales) ? sales.reduce((sum, s) => sum + (s.profit || 0), 0) : 0;

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
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' }}>Ventas</h1>
          <p style={{ color: '#71717a' }}>Registrá y gestioná tus ventas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f472b6', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>
          {showForm ? '✕ Cancelar' : '+ Nueva Venta'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #2a2a3e', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>Registrar Venta</h2>
          
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Buscar Producto</label>
            <input 
              type="text" 
              value={productSearch} 
              onChange={(e) => {
                setProductSearch(e.target.value);
                if (!e.target.value) setForm({ ...form, product_id: '', sale_price: '' });
              }}
              placeholder="Escribí el nombre o código del producto..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', fontSize: '1rem' }}
            />
{productSearch && filteredProducts.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#1a1a2e', border: '1px solid #3f3f5a', borderRadius: '0.5rem', maxHeight: '300px', overflowY: 'auto', zIndex: 10, marginTop: '0.25rem' }}>
                {filteredProducts.slice(0, 10).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProduct(p)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', textAlign: 'left', backgroundColor: 'transparent', border: 'none', borderBottom: '1px solid #2a2a3e', color: '#fff', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    {p.image && Array.isArray(p.image) && p.image[0] && (
                      <img src={p.image[0]} alt="" style={{ width: '40px', height: '40px', borderRadius: '0.5rem', objectFit: 'cover', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{p.id}</div>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#10b981' }}>${(p.price || 0).toLocaleString('es-AR')}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {form.product_id && (() => {
            const selectedProduct = products.find(p => p.id === form.product_id);
            return selectedProduct ? (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#10b98120', borderRadius: '0.5rem', border: '1px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {selectedProduct.image && Array.isArray(selectedProduct.image) && selectedProduct.image[0] && (
                      <img src={selectedProduct.image[0]} alt="" style={{ width: '40px', height: '40px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                    )}
                    <div>
                      <div style={{ color: '#fff', fontWeight: '500' }}>{selectedProduct.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{selectedProduct.id}</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setForm({ ...form, product_id: '', sale_price: '' }); setProductSearch(''); }} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.75rem' }}>Cambiar</button>
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
  }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Precio de Venta</label>
              <input type="number" required value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff' }} placeholder="Ej: 15000" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>Cantidad</label>
              <input type="number" required min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>ID Orden ML (opcional)</label>
              <input type="text" value={form.ml_order_id} onChange={(e) => setForm({ ...form, ml_order_id: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff' }} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button type="submit" disabled={saving} style={{ padding: '0.75rem 2rem', backgroundColor: '#f472b6', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}>
                {saving ? 'Guardando...' : 'Guardar Venta'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #2a2a3e' }}>
          <div style={{ fontSize: '0.875rem', color: '#71717a' }}>Total Ventas</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>{sales.length}</div>
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
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Comisión ML</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Neto</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Ganancia</th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}></th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => {
              return (
                <tr key={sale.id} style={{ borderTop: '1px solid #2a2a3e' }}>
                  <td style={{ padding: '1rem', color: '#a1a1aa' }}>{new Date(sale.created_at).toLocaleDateString('es-AR')}</td>
                  <td style={{ padding: '1rem', color: '#fff' }}>{sale.productName || '—'}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#a1a1aa' }}>${(sale.sale_price || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#ef4444' }}>-${(sale.ml_fees || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#fff' }}>${(sale.net_received || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: (sale.profit || 0) >= 0 ? '#10b981' : '#ef4444' }}>${(sale.profit || 0).toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button onClick={() => deleteSale(sale.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sales.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#71717a' }}>No hay ventas registradas</div>
        )}
      </div>
    </AdminLayout>
  );
}
