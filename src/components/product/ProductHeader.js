import Link from 'next/link';

export function ProductHeader({ isMobile }) {
  return (
    <header style={{
      backgroundColor: '#fff',
      borderBottom: '1px solid #e5e7eb',
      padding: isMobile ? '12px 16px' : '16px 5%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 10
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          cursor: 'pointer'
        }}>
          <div style={{
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            backgroundColor: '#7c3aed',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: isMobile ? '14px' : '18px',
            cursor: 'pointer'
          }}>
            M&M
          </div>
          <span style={{
            fontSize: isMobile ? '14px' : '18px',
            fontWeight: 600,
            color: '#111827'
          }}>
            Beauty and Skincare
          </span>
        </Link>

        <Link href="/" style={{
          textDecoration: 'none',
          color: '#6b7280',
          fontSize: isMobile ? '12px' : '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          ← {isMobile ? 'Volver' : 'Volver a productos'}
        </Link>
      </div>
    </header>
  );
}
