import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (showUserMenu || showLoginModal) {
      const handleClick = () => {
        setShowUserMenu(false);
        setShowLoginModal(false);
      };
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [showUserMenu, showLoginModal]);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  }

  async function handleLogin(e) {
    e.stopPropagation();
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    
    console.log('Intentando login con:', loginForm.email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password,
    });

    console.log('Respuesta:', { data, error });

    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
    } else if (data?.user) {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
      setLoginLoading(false);
    }
  }

  async function handleLogout(e) {
    e.stopPropagation();
    await supabase.auth.signOut();
    setUser(null);
    setShowUserMenu(false);
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Productos', icon: '📦' },
    { href: '/admin/sales', label: 'Ventas', icon: '💰' },
    { href: '/admin/profitability', label: 'Rentabilidad', icon: '📈' },
    { href: '/admin/ml', label: 'ML', icon: '📦' },
  ];

  const isActive = (href) => router.pathname === href;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#a1a1aa' }}>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ 
          backgroundColor: '#1a1a2e', 
          borderRadius: '1rem', 
          padding: '3rem', 
          width: '100%', 
          maxWidth: '400px', 
          border: '1px solid #2a2a3e',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Acceso Restringido
          </h2>
          <p style={{ color: '#71717a', marginBottom: '1.5rem' }}>
            Necesitás iniciar sesión para acceder al panel de administración
          </p>
          {loginError && (
            <div style={{ 
              backgroundColor: '#ef444420', 
              color: '#ef4444', 
              padding: '0.75rem', 
              borderRadius: '0.5rem', 
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3f3f5a',
                  backgroundColor: '#161625',
                  color: '#fff',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <input
                type="password"
                placeholder="Contraseña"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #3f3f5a',
                  backgroundColor: '#161625',
                  color: '#fff',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: '#f472b6',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: loginLoading ? 0.7 : 1
              }}
            >
              {loginLoading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f1a' }}>
      <nav style={{ backgroundColor: '#161625', borderBottom: '1px solid #2a2a3e' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '64px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Link href="/admin" style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f472b6', textDecoration: 'none', letterSpacing: '-0.025em' }}>
                M&M <span style={{ color: '#fff' }}>Beauty</span>
              </Link>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: isActive(item.href) ? '#f472b6' : '#a1a1aa',
                      backgroundColor: isActive(item.href) ? '#f472b615' : 'transparent',
                      borderRadius: '0.5rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link href="/" style={{ color: '#71717a', fontSize: '0.875rem', textDecoration: 'none' }}>
                Ver tienda →
              </Link>
              
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowUserMenu(!showUserMenu); }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: '#2a2a3e',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    color: '#fff',
                    fontSize: '0.875rem'
                  }}
                >
                  <span>👤</span>
                  <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </span>
                  <span style={{ fontSize: '0.75rem' }}>▼</span>
                </button>
                {showUserMenu && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '100%', 
                    right: 0, 
                    marginTop: '0.5rem',
                    backgroundColor: '#1a1a2e', 
                    border: '1px solid #2a2a3e',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    zIndex: 100,
                    minWidth: '150px'
                  }}>
                    <button 
                      onClick={handleLogout}
                      style={{ 
                        display: 'block',
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </main>
    </div>
  );
}
