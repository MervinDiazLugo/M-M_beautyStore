import { useEffect } from 'react';

export function InstagramReelEmbed({ product, isMobile }) {
  const hasReel = product.instagramReel && product.instagramReel.trim() !== '';
  
  if (!hasReel) {
    return null;
  }
  
  const reelUrl = product.instagramReel;
  const hasSpecs = product.specifications && Object.keys(product.specifications).length > 0;
  const shouldBeSmall = !hasSpecs;
  
  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    
    const script = document.createElement('script');
    script.src = '//www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };
    document.body.appendChild(script);
    
    return () => {
      // No removemos el script para evitar recargas innecesarias
    };
  }, []);
  
  const containerStyle = shouldBeSmall 
    ? { 
        background: '#fff', 
        padding: isMobile ? '16px' : '20px', 
        borderRadius: '12px', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        maxWidth: '450px',
        margin: '0 auto 32px auto'
      }
    : {
        background: '#fff',
        padding: isMobile ? '20px' : '28px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      };
  
  return (
    <div style={containerStyle}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px'
      }}>
        <svg width={shouldBeSmall ? "20" : "24"} height={shouldBeSmall ? "20" : "24"} viewBox="0 0 24 24" fill="url(#igGradient)">
          <defs>
            <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#833AB4" />
              <stop offset="50%" stopColor="#E1306C" />
              <stop offset="100%" stopColor="#F77737" />
            </linearGradient>
          </defs>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        <span style={{ 
          fontWeight: 600, 
          fontSize: shouldBeSmall ? (isMobile ? '13px' : '14px') : (isMobile ? '14px' : '16px'), 
          color: '#111827' 
        }}>
          Ver en Instagram
        </span>
      </div>
      
      <blockquote 
        className="instagram-media" 
        data-instgrm-captioned 
        data-instgrm-permalink={reelUrl}
        data-instgrm-version="14"
        style={{ 
          background: '#FFF', 
          border: '0', 
          borderRadius: '12px', 
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', 
          margin: '1px', 
          maxWidth: '540px', 
          minWidth: '250px', 
          padding: '0', 
          width: '100%'
        }}
      />
      
      <a 
        href={reelUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: '12px',
          color: '#3897f0',
          textDecoration: 'none',
          fontSize: shouldBeSmall ? '13px' : '14px',
          fontWeight: 500
        }}
      >
        Ver en Instagram ↗
      </a>
    </div>
  );
}
