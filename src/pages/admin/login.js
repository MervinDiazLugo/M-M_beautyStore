import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin');
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f1a' }}>
      <div style={{ color: '#f472b6', fontSize: '1.25rem' }}>Cargando...</div>
    </div>
  );
}
