import { useEffect, useState } from 'react';
import AdminLayout from './layout';
import { adminFetch } from '../../lib/adminApi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ cost: '', packaging_cost: '' });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const res = await adminFetch('/api/admin/products');
    const data = await res.json();
    setProducts(data || []);
    setLoading(false);
  }

  async function syncFromML() {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await adminFetch('/api/admin/ml/sync-items', { method: 'POST' });
      const data = await res.json();
      setSyncResult(data);
      if (data.success) {
        loadProducts();
      }
    } catch (err) {
      setSyncResult({ error: err.message });
    }
    setSyncing(false);
  }

  async function saveCost(productId) {
    setSaving(true);
    await adminFetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cost: parseFloat(editForm.cost) || 0,
        packaging_cost: parseFloat(editForm.packaging_cost) || 1000,
      }),
    });
    loadProducts();
    setEditingId(null);
    setSaving(false);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setEditForm({
      cost: product.cost || '',
      packaging_cost: product.packaging_cost || 1000,
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = search === '' || 
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.toLowerCase().includes(search.toLowerCase());
    
    if (filter === 'withCost') return matchesSearch && p.cost && p.cost > 0;
    if (filter === 'withoutCost') return matchesSearch && (!p.cost || p.cost === 0);
    
    return matchesSearch;
  }).sort((a, b) => {
    let aVal, bVal;
    
    if (sortField === 'name') {
      aVal = a.name?.toLowerCase() || '';
      bVal = b.name?.toLowerCase() || '';
    } else if (sortField === 'price') {
      aVal = a.price || 0;
      bVal = b.price || 0;
    } else if (sortField === 'cost') {
      aVal = a.cost || 0;
      bVal = b.cost || 0;
    } else if (sortField === 'profit') {
      const getProfit = (p) => {
        const salePrice = p.price || 0;
        const cost = p.cost || 0;
        const packaging = p.packaging_cost || 1000;
        return salePrice - (salePrice * 0.34) - cost - packaging;
      };
      aVal = getProfit(a);
      bVal = getProfit(b);
    } else {
      return 0;
    }
    
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const stats = {
    total: products.length,
    withCost: products.filter(p => p.cost && p.cost > 0).length,
    withoutCost: products.filter(p => !p.cost || p.cost === 0).length,
  };

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#a1a1aa' }}>Cargando...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' }}>Productos</h1>
          <p style={{ color: '#71717a' }}>Gestiona los costos de tus productos</p>
        </div>
        <button
          onClick={syncFromML}
          disabled={syncing}
          style={{
            padding: '0.75rem 1.25rem',
            backgroundColor: syncing ? '#3f3f5a' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: syncing ? 'not-allowed' : 'pointer',
          }}
        >
          {syncing ? 'Sincronizando...' : '🔄 Sincronizar desde ML'}
        </button>
      </div>

      {syncResult && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '0.5rem',
          backgroundColor: syncResult.error ? '#ef444420' : '#10b98120',
          color: syncResult.error ? '#ef4444' : '#10b981',
        }}>
          {syncResult.error ? `Error: ${syncResult.error}` : syncResult.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nombre o código MLA..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #3f3f5a',
            backgroundColor: '#1a1a2e',
            color: '#fff',
            fontSize: '0.875rem'
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { key: 'all', label: 'Todos' },
            { key: 'withCost', label: 'Con costo' },
            { key: 'withoutCost', label: 'Sin costo' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: filter === f.key ? '#f472b6' : '#2a2a3e',
                color: filter === f.key ? '#fff' : '#a1a1aa',
              }}
            >
              {f.label} ({f.key === 'all' ? stats.total : f.key === 'withCost' ? stats.withCost : stats.withoutCost})
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', border: '1px solid #2a2a3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#161625' }}>
              <th style={{ padding: '1rem', textAlign: 'center', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', width: '50px' }}>#</th>
              <th onClick={() => handleSort('name')} style={{ padding: '1rem', textAlign: 'left', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                Producto {sortField === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('price')} style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                Venta {sortField === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#f59e0b', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                ML Fee
              </th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#22d3ee', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                Net
              </th>
              <th onClick={() => handleSort('cost')} style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                Costo {sortField === 'cost' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Pack</th>
              <th onClick={() => handleSort('profit')} style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none' }}>
                Ganancia {sortField === 'profit' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '1rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.75rem', textTransform: 'uppercase' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => {
              const salePrice = product.price || 0;
              const cost = product.cost || 0;
              const packaging = product.packaging_cost || 1000;
              const mlFee = salePrice * 0.34;
              const netReceived = salePrice - mlFee;
              const profit = netReceived - cost - packaging;

              return (
                <tr key={product.id} style={{ borderTop: '1px solid #2a2a3e' }}>
                  <td style={{ padding: '1rem', textAlign: 'center', color: '#71717a', fontSize: '0.75rem' }}>{index + 1}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      {product.image && Array.isArray(product.image) && product.image[0] && <img src={product.image[0]} alt="" style={{ width: '40px', height: '40px', borderRadius: '0.5rem', objectFit: 'cover' }} />}
                      <span style={{ color: '#fff', fontWeight: '500' }}>{product.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#a1a1aa' }}>${salePrice.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#f59e0b' }}>-${mlFee.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#22d3ee' }}>${netReceived.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editForm.cost}
                        onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })}
                        style={{ width: '80px', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', textAlign: 'right' }}
                      />
                    ) : (
                      <span style={{ color: cost > 0 ? '#10b981' : '#71717a' }}>{cost > 0 ? `$${cost.toLocaleString('es-AR')}` : '—'}</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', color: '#a1a1aa' }}>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editForm.packaging_cost}
                        onChange={(e) => setEditForm({ ...editForm, packaging_cost: e.target.value })}
                        style={{ width: '80px', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', textAlign: 'right' }}
                      />
                    ) : (
                      `$${packaging.toLocaleString('es-AR')}`
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: profit >= 0 ? '#10b981' : '#ef4444' }}>
                    ${profit.toLocaleString('es-AR')}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {editingId === product.id ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button onClick={() => saveCost(product.id)} disabled={saving} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>✓</button>
                        <button onClick={cancelEdit} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#3f3f5a', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>✕</button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(product)} style={{ padding: '0.375rem 0.75rem', backgroundColor: '#f472b6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: '500' }}>Editar</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#71717a' }}>
            {search ? 'No se encontraron productos' : 'No hay productos'}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
