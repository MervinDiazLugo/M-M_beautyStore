import { useEffect, useState } from 'react';
import AdminLayout from './layout';

export default function MLIntegration() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('sales');
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    checkConnection();
  }, []);

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      const res = await fetch('/api/admin/ml/status');
      const data = await res.json();
      setConnected(data.connected || false);
    } catch (e) {
      setConnected(false);
    }
    setLoading(false);
  }

  async function connect() {
    const res = await fetch('/api/admin/ml/auth');
    const data = await res.json();
    if (data.authUrl) {
      window.location.href = data.authUrl;
    }
  }

  async function sync() {
    setSyncing(true);
    setResult(null);
    try {
      const res = await fetch('/api/admin/ml/sync', { method: 'POST' });
      const data = await res.json();
      setResult(data);
      // Load shipments after sync
      const shipRes = await fetch('/api/admin/ml/shipments');
      const shipData = await shipRes.json();
      setShipments(shipData.shipments || []);
    } catch (e) {
      setResult({ error: e.message });
    }
    setSyncing(false);
  }

  async function disconnect() {
    await fetch('/api/admin/ml/disconnect', { method: 'POST' });
    setConnected(false);
    setResult(null);
  }

  async function debug() {
    const res = await fetch('/api/admin/ml/debug');
    const data = await res.json();
    console.log('ML Debug:', data);
    alert(JSON.stringify(data, null, 2));
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
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#fff', marginBottom: '0.25rem' }}>Mercado Libre</h1>
        <p style={{ color: '#71717a' }}>Conectá tu cuenta de Mercado Libre para sincronizar ventas</p>
      </div>

      <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '2rem', border: '1px solid #2a2a3e', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', backgroundColor: '#fff2cc', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2rem' }}>📦</span>
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', color: '#fff' }}>Conexión con Mercado Libre</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span style={{ color: connected ? '#10b981' : '#ef4444' }}>
                {connected ? '✅ Conectado' : '❌ No conectado'}
              </span>
              {connected && (
                <button
                  onClick={disconnect}
                  title="Desconectar"
                  style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  ⏻
                </button>
              )}
            </div>
            {!connected && (
              <button
                onClick={connect}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#f472b6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem'
                }}
              >
                Conectar
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={sync}
            disabled={!connected || syncing}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f472b6',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: (!connected || syncing) ? 'not-allowed' : 'pointer',
              opacity: syncing ? 0.7 : 1
            }}
          >
            {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar'}
          </button>
        </div>

        {activeTab === 'sales' && (
          <div>
            {syncing && (
              <div style={{ color: '#a1a1aa' }}>Sincronizando ventas...</div>
            )}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: result.error ? '#ef444420' : '#10b98120', borderRadius: '0.5rem' }}>
            {result.error ? (
              <div style={{ color: '#ef4444' }}>❌ {result.error}</div>
            ) : (
              <div style={{ color: '#10b981' }}>
                ✅ Sincronización completa<br/>
                - Ventas importadas: {result.imported}<br/>
                - Ventas omitidas: {result.skipped}
              </div>
            )}
          </div>
        )}

        {activeTab === 'shipments' && (
          <div>
            {loadingShipments ? (
              <div style={{ color: '#a1a1aa' }}>Cargando envíos...</div>
            ) : shipments.length === 0 ? (
              <div style={{ color: '#a1a1aa' }}>No hay envíos en tránsito</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#161625' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#71717a', fontSize: '0.75rem' }}>Producto</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#71717a', fontSize: '0.75rem' }}>Comprador</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#71717a', fontSize: '0.75rem' }}>Dirección</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: '#71717a', fontSize: '0.75rem' }}>Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => (
                    <tr key={s.id} style={{ borderTop: '1px solid #2a2a3e' }}>
                      <td style={{ padding: '0.75rem', color: '#fff' }}>{s.product}</td>
                      <td style={{ padding: '0.75rem', color: '#a1a1aa' }}>{s.buyer}</td>
                      <td style={{ padding: '0.75rem', color: '#a1a1aa' }}>{s.address}</td>
                      <td style={{ padding: '0.75rem', color: '#a1a1aa' }}>{s.tracking || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: '#1a1a2e', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #2a2a3e' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>¿Cómo funciona?</h2>
        <ol style={{ color: '#a1a1aa', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Hacé click en "Conectar con Mercado Libre"</li>
          <li>Autorizá el acceso a tu cuenta de ML</li>
          <li>Una vez conectado, hacé click en "Sincronizar Ventas"</li>
          <li>Las ventas de ML se importarán automáticamente</li>
        </ol>
      </div>
    </AdminLayout>
  );
}
