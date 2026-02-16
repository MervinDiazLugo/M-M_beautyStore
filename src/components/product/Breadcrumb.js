import Link from 'next/link';

export function Breadcrumb({ product, isMobile }) {
  return (
    <nav style={{
      color: '#6b7280',
      marginBottom: isMobile ? '16px' : '24px',
      fontSize: isMobile ? '12px' : '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      flexWrap: 'wrap'
    }}>
      <Link href="/" style={{ textDecoration: 'none', color: '#6b7280' }}>
        Inicio
      </Link>
      <span>/</span>
      <span style={{
        color: '#111827',
        fontWeight: 500,
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {isMobile ? product.name.substring(0, 30) + (product.name.length > 30 ? '...' : '') : product.name}
      </span>
    </nav>
  );
}
