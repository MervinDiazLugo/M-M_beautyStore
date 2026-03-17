import { useEffect, useState } from 'react';
import AdminLayout from './layout';

export default function MLIntegration() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState(null);

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
    } catch (e) {
      setResult({ error: e.message });
    }
    setSyncing(false);
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
            <div style={{ color: connected ? '#10b981' : '#ef4444' }}>
              {connected ? '✅ Conectado' : '❌ No conectado'}
            </div>
          </div>
        </div>

        {!connected ? (
          <button
            onClick={connect}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#f472b6',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔗 Conectar con Mercado Libre
          </button>
        ) : (
          <div>
            <button
              onClick={sync}
              disabled={syncing}
              style={{
                padding: '0.75rem 2rem',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: syncing ? 'not-allowed' : 'pointer',
                opacity: syncing ? 0.7 : 1
              }}
            >
              {syncing ? '⏳ Sincronizando...' : '🔄 Sincronizar Ventas'}
            </button>
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
