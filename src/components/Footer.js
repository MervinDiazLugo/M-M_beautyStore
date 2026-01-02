import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      textAlign: 'center',
      padding: '25px 20px',
      marginTop: '40px',
      borderTop: '2px solid #9c27b0',
      backgroundColor: '#f8f5fa',
      color: '#333',
      width: '100%',
      position: 'relative',
      bottom: 0,
      left: 0,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1100px', 
        margin: '0 auto',
        padding: '0 15px'
      }}>
        
        {/* Nombre de la tienda */}
        <div style={{ 
            margin: 0,
            fontSize: '14px',
            color: '#757575',
            fontWeight: '500'
        }}>
            © {currentYear} <span style={{ color: '#9c27b0' }}>M&M Beauty Store</span>. Todos los derechos reservados.<br/><br/>
        </div>
        
        {/* Enlaces importantes */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          fontSize: '14px',
          marginBottom: '20px',
          flexWrap: 'wrap'
        }}>
          <a href="/preguntas-frecuentes" style={{ 
            color: '#9c27b0', 
            textDecoration: 'none',
            fontWeight: 500,
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid #e0d0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12" y2="17"></line>
            </svg>
            Preguntas frecuentes
          </a>
          <a href="/envios" style={{ 
            color: '#9c27b0', 
            textDecoration: 'none',
            fontWeight: 500,
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid #e0d0f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11"></path>
              <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2"></path>
              <circle cx="7" cy="18" r="2"></circle>
              <path d="M15 18H9"></path>
              <circle cx="17" cy="18" r="2"></circle>
            </svg>
            Información de Envíos
          </a>
        </div>
        
        {/* Información de contacto */}
        <div style={{
          marginBottom: '15px',
          fontSize: '14px',
          color: '#666',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            storebeauty.mm@gmail.com
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            +54 11 2394-2598
          </div>
          
          {/* REDES SOCIALES */}
          <div style={{
            display: 'flex',
            gap: '15px',
            marginTop: '5px'
          }}>
            {/* Instagram */}
            <a 
              href="https://instagram.com/mmbeautystoreok" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#9c27b0',
                textDecoration: 'none',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
              <span style={{ fontSize: '13px' }}>Instagram</span>
            </a>
            
            {/* TikTok */}
            <a 
              href="https://tiktok.com/@mmbeautystoreok" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="TikTok"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#9c27b0',
                textDecoration: 'none',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
              </svg>
              <span style={{ fontSize: '13px' }}>TikTok</span>
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div style={{
          borderTop: '1px solid #e0d0f0',
          paddingTop: '15px',
          marginTop: '15px'
        }}>
          <p style={{ 
            margin: '8px 0 0 0',
            fontSize: '12px',
            color: '#999'
          }}>
            Los precios incluyen IVA • Envíos a todo el país
          </p>
        </div>
        
        {/* MEDIOS DE PAGO MEJORADOS */}
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#888',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Medios de pago aceptados:
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '10px'
          }}>
            {/* Tarjetas de crédito/débito */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9c27b0" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
                <circle cx="6" cy="14" r="1.5"></circle>
                <circle cx="10" cy="14" r="1.5"></circle>
              </svg>
              <span style={{ fontSize: '11px', color: '#666' }}>Tarjetas</span>
            </div>
            
            {/* Transferencia bancaria */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9c27b0" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
                <path d="M7 14h.01M11 14h.01"></path>
                <path d="M2 8h20"></path>
              </svg>
              <span style={{ fontSize: '11px', color: '#666' }}>Transferencia</span>
            </div>
            
            {/* Efectivo */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9c27b0" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v12"></path>
                <path d="M15 9.5A2.5 2.5 0 0 0 12 7H11a2 2 0 0 0 0 4h1a2 2 0 0 1 0 4h-1a2.5 2.5 0 0 1 0-5"></path>
              </svg>
              <span style={{ fontSize: '11px', color: '#666' }}>Efectivo</span>
            </div>
            
            {/* QR - REEMPLAZANDO MERCADO PAGO */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#9c27b0" strokeWidth="2">
                {/* Código QR simplificado */}
                <rect x="3" y="3" width="6" height="6" strokeWidth="2"></rect>
                <rect x="15" y="3" width="6" height="6" strokeWidth="2"></rect>
                <rect x="3" y="15" width="6" height="6" strokeWidth="2"></rect>
                <rect x="15" y="15" width="6" height="6" strokeWidth="2"></rect>
                <line x1="9" y1="3" x2="9" y2="6" strokeWidth="2"></line>
                <line x1="12" y1="3" x2="12" y2="6" strokeWidth="2"></line>
                <line x1="9" y1="21" x2="9" y2="18" strokeWidth="2"></line>
                <line x1="12" y1="21" x2="12" y2="18" strokeWidth="2"></line>
                <line x1="3" y1="9" x2="6" y2="9" strokeWidth="2"></line>
                <line x1="3" y1="12" x2="6" y2="12" strokeWidth="2"></line>
                <line x1="21" y1="9" x2="18" y2="9" strokeWidth="2"></line>
                <line x1="21" y1="12" x2="18" y2="12" strokeWidth="2"></line>
                <rect x="9" y="9" width="6" height="6" strokeWidth="1.5"></rect>
              </svg>
              <span style={{ fontSize: '11px', color: '#666' }}>QR</span>
            </div>
          </div>
          
          {/* Texto informativo adicional */}
          <div style={{
            fontSize: '11px',
            color: '#999',
            fontStyle: 'italic',
            marginTop: '8px'
          }}>
            Aceptamos todas las tarjetas y formas de pago seguras
          </div>
        </div>
        
      </div>
      
      {/* Estilos responsivos */}
      <style jsx>{`
        @media (max-width: 768px) {
          footer {
            padding: 20px 15px !important;
            margin-top: 30px !important;
          }
          
          div[style*="gap: 20px"] {
            gap: 15px !important;
            font-size: 13px !important;
          }
          
          div[style*="flexDirection: column"] {
            font-size: 13px !important;
          }
        }
        
        @media (max-width: 480px) {
          footer {
            padding: 15px 10px !important;
          }
          
          div[style*="gap: 20px"] {
            flex-direction: column !important;
            gap: 10px !important;
            align-items: center !important;
          }
          
          div[style*="gap: 20px"] a {
            width: 80% !important;
            text-align: center !important;
            padding: 8px !important;
            justify-content: center;
          }
          
          /* Ajustes para las redes sociales en móvil */
          div[style*="gap: 15px"] {
            flex-direction: column !important;
            gap: 10px !important;
          }
          
          /* Ajustes para medios de pago en móvil */
          div[style*="gap: 20px"]:last-child {
            gap: 15px !important;
          }
          
          div[style*="flexDirection: column"]:last-child {
            min-width: 60px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;