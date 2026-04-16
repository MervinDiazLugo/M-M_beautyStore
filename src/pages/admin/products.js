import { useEffect, useState } from 'react';
import AdminLayout from './layout';
import { adminFetch } from '../../lib/adminApi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ cost: '', packaging_cost: '', ml_price: '' });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 10000);
  }

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

  async function saveCost(product) {
    setSaving(true);
    
    const updates = {
      cost: parseFloat(editForm.cost) || 0,
      packaging_cost: parseFloat(editForm.packaging_cost) || 1000,
    };
    
    if (editForm.ml_price && product.ml_item_id && parseInt(editForm.ml_price) !== product.ml_price) {
      const newMlPrice = parseInt(editForm.ml_price);

      try {
        const mlRes = await adminFetch('/api/admin/products/ml-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updatePrice',
            productId: product.id,
            mlItemId: product.ml_item_id,
            price: newMlPrice,
          }),
        });
        const mlData = await mlRes.json();

        if (mlData.success) {
          updates.price = mlData.storePrice;
          updates.ml_price = mlData.mlPrice;
          showToast(`Precio actualizado: ML $${mlData.mlPrice?.toLocaleString('es-AR')}, Tienda $${mlData.storePrice?.toLocaleString('es-AR')}`);
        } else {
          showToast('Error al actualizar ML: ' + (mlData.error || 'Desconocido'), 'error');
        }
      } catch (err) {
        showToast('Error: ' + err.message, 'error');
      }
    }

    await adminFetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    loadProducts();
    setEditingId(null);
    setSaving(false);
  }

  async function togglePublished(product) {
    const newStatus = product.published === false;
    await adminFetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: product.id,
        published: newStatus,
      }),
    });
    loadProducts();
  }

  function confirmToggleMlStatus(product) {
    if (!product.ml_item_id) {
      showToast('Este producto no tiene ID de ML. Sincronizá primero.', 'error');
      return;
    }
    setConfirmModal({
      product,
      action: 'toggleMl',
      title: product.published ? 'Pausar en ML' : 'Activar en ML',
      message: `¿Querés ${product.published ? 'pausar' : 'activar'} "${product.name}" en MercadoLibre?`,
    });
  }

  async function executeConfirm() {
    if (!confirmModal) return;
    
    const { product, action } = confirmModal;
    
    if (action === 'toggleMl') {
      try {
        const res = await adminFetch('/api/admin/products/ml-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateStatus',
            productId: product.id,
            mlItemId: product.ml_item_id,
            status: !product.published,
          }),
        });
        const data = await res.json();
        
        if (data.success) {
          showToast(`Producto ${data.mlStatus === 'active' ? 'activado' : 'pausado'} en ML`);
          loadProducts();
        } else {
          showToast('Error: ' + (data.error || 'No se pudo actualizar'), 'error');
        }
      } catch (err) {
        showToast('Error: ' + err.message, 'error');
      }
    }
    
    setConfirmModal(null);
  }

  function startEdit(product) {
    setEditingId(product.id);
    setEditForm({
      cost: product.cost || '',
      packaging_cost: product.packaging_cost || 1000,
      ml_price: product.ml_price || '',
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
    
    if (statusFilter === 'published') return matchesSearch && p.published !== false;
    if (statusFilter === 'unpublished') return matchesSearch && p.published === false;
    
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
      aVal = a.profit || 0;
      bVal = b.profit || 0;
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
    published: products.filter(p => p.published !== false).length,
    unpublished: products.filter(p => p.published === false).length,
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
            { key: 'published', label: `✓ Activos (${stats.published})` },
            { key: 'unpublished', label: `✕ Pausados (${stats.unpublished})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => f.key === 'published' || f.key === 'unpublished' ? setStatusFilter(f.key) : setFilter(f.key)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                backgroundColor: (filter === f.key || statusFilter === f.key) ? '#f472b6' : '#2a2a3e',
                color: (filter === f.key || statusFilter === f.key) ? '#fff' : '#a1a1aa',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', border: '1px solid #2a2a3e', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ backgroundColor: '#161625' }}>
              <th style={{ padding: '0.75rem', textAlign: 'center', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', width: '40px' }}>#</th>
              <th onClick={() => handleSort('name')} style={{ padding: '0.75rem', textAlign: 'left', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                Producto {sortField === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'right', color: '#f59e0b', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Precio ML
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'right', color: '#a1a1aa', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Precio Tienda
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'right', color: '#f59e0b', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                ML Fee
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'right', color: '#22d3ee', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Net
              </th>
              <th onClick={() => handleSort('cost')} style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                Costo {sortField === 'cost' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Pack</th>
              <th onClick={() => handleSort('profit')} style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
                Ganancia {sortField === 'profit' && (sortDir === 'asc' ? '↑' : '↓')}
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'center', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Activo
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'center', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Links
              </th>
              <th style={{ padding: '0.75rem', textAlign: 'right', color: '#71717a', fontWeight: '500', fontSize: '0.7rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => {
              const mlPrice = product.ml_price || 0;
              const storePrice = product.price || 0;
              const cost = product.cost || 0;
              const packaging = product.packaging_cost || 0;
              const mlFee = product.ml_fee || 0;
              const netReceived = product.net_received || 0;
              const profit = product.profit || 0;

              return (
                <tr key={product.id} style={{ borderTop: '1px solid #2a2a3e' }}>
                  <td style={{ padding: '0.75rem', textAlign: 'center', color: '#71717a', fontSize: '0.7rem' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {product.image && Array.isArray(product.image) && product.image[0] && <img src={product.image[0]} alt="" style={{ width: '32px', height: '32px', borderRadius: '0.375rem', objectFit: 'cover' }} />}
                      <span style={{ color: '#fff', fontWeight: '500', fontSize: '0.8rem' }} title={product.name}>{product.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editForm.ml_price}
                        onChange={(e) => {
                          const newMlPrice = e.target.value;
                          setEditForm({ ...editForm, ml_price: newMlPrice });
                        }}
                        style={{ width: '80px', padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid #f59e0b', backgroundColor: '#161625', color: '#f59e0b', textAlign: 'right', fontSize: '0.75rem' }}
                      />
                    ) : (
                      <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: '600' }}>${mlPrice.toLocaleString('es-AR')}</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#a1a1aa', fontSize: '0.75rem' }}>${storePrice.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#f59e0b', fontSize: '0.75rem' }}>-${mlFee.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#22d3ee', fontSize: '0.75rem' }}>${netReceived.toLocaleString('es-AR')}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editForm.cost}
                        onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })}
                        style={{ width: '80px', padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', textAlign: 'right', fontSize: '0.75rem' }}
                      />
                    ) : (
                      <span style={{ color: cost > 0 ? '#10b981' : '#71717a', fontSize: '0.75rem' }}>{cost > 0 ? `$${cost.toLocaleString('es-AR')}` : '—'}</span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#a1a1aa', fontSize: '0.75rem' }}>
                    {editingId === product.id ? (
                      <input
                        type="number"
                        value={editForm.packaging_cost}
                        onChange={(e) => setEditForm({ ...editForm, packaging_cost: e.target.value })}
                        style={{ width: '80px', padding: '0.25rem', borderRadius: '0.25rem', border: '1px solid #3f3f5a', backgroundColor: '#161625', color: '#fff', textAlign: 'right', fontSize: '0.75rem' }}
                      />
                    ) : (
                      `$${packaging.toLocaleString('es-AR')}`
                    )}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: profit >= 0 ? '#10b981' : '#ef4444', fontSize: '0.75rem' }}>
                    ${profit.toLocaleString('es-AR')}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                    <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={product.published !== false}
                        onChange={() => togglePublished(product)}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: product.published === false ? '#3f3f5a' : '#10b981',
                        borderRadius: '22px',
                        transition: '0.3s',
                      }}>
                        <span style={{
                          position: 'absolute',
                          height: '16px',
                          width: '16px',
                          left: product.published === false ? '4px' : '20px',
                          bottom: '3px',
                          backgroundColor: '#fff',
                          borderRadius: '50%',
                          transition: '0.3s',
                        }} />
                      </span>
                    </label>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {product.mercado_libre_url && (
                      <a href={product.mercado_libre_url} target="_blank" rel="noopener noreferrer" title="Ver en ML" style={{ color: '#f59e0b', marginRight: '0.5rem' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                      </a>
                    )}
                    <a href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" title="Ver en tienda" style={{ color: '#f472b6' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </a>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    {editingId === product.id ? (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button onClick={() => saveCost(product)} disabled={saving} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.7rem' }}>✓</button>
                        <button onClick={cancelEdit} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#3f3f5a', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.7rem' }}>✕</button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(product)} style={{ padding: '0.25rem 0.5rem', backgroundColor: '#f472b6', color: '#fff', border: 'none', borderRadius: '0.25rem', cursor: 'pointer', fontWeight: '500', fontSize: '0.7rem' }}>Editar</button>
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

      {confirmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #2a2a3e', width: '400px', maxWidth: '90%' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff', marginBottom: '0.75rem' }}>{confirmModal.title}</h2>
            <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: '1.5rem', wordBreak: 'break-word' }}>{confirmModal.message}</p>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                onClick={() => setConfirmModal(null)}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#3f3f5a', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
              >
                Cancelar
              </button>
              <button 
                onClick={executeConfirm}
                style={{ flex: 1, padding: '0.75rem', backgroundColor: confirmModal.action === 'toggleMl' && confirmModal.product.published ? '#f59e0b' : '#10b981', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600' }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          padding: '1rem 1.5rem',
          borderRadius: '0.75rem',
          backgroundColor: toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : '#10b981',
          color: '#fff',
          fontWeight: '600',
          fontSize: '0.875rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease-out',
        }}>
          {toast.message}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </AdminLayout>
  );
}
