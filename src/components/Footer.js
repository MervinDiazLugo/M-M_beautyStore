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
        
        {/* Logo o nombre de la tienda */}
        <div style={{ 
          marginBottom: '15px',
          fontWeight: 'bold',
          fontSize: '18px',
          color: '#9c27b0'
        }}>
          🛍️ M&M - Beauty and Skincare store
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
          <a href="/terminos" style={{ 
            color: '#9c27b0', 
            textDecoration: 'none',
            fontWeight: 500,
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid #e0d0f0'
          }}>
            📄 Términos
          </a>
          <a href="/privacidad" style={{ 
            color: '#9c27b0', 
            textDecoration: 'none',
            fontWeight: 500,
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid #e0d0f0'
          }}>
            🔒 Privacidad
          </a>
          <a href="/contacto" style={{ 
            color: '#9c27b0', 
            textDecoration: 'none',
            fontWeight: 500,
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid #e0d0f0'
          }}>
            📞 Contacto
          </a>
        </div>
        
        {/* Información de contacto */}
        <div style={{
          marginBottom: '15px',
          fontSize: '14px',
          color: '#666'
        }}>
          <div style={{ marginBottom: '5px' }}>
            📧 contacto@mitienda.com
          </div>
          <div>
            📱 +54 11 2250-3272
          </div>
        </div>
        
        {/* Copyright - MÁS VISIBLE */}
        <div style={{
          borderTop: '1px solid #e0d0f0',
          paddingTop: '15px',
          marginTop: '15px'
        }}>
          <p style={{ 
            margin: 0,
            fontSize: '14px',
            color: '#757575',
            fontWeight: '500'
          }}>
            © {currentYear} <span style={{ color: '#9c27b0' }}>M&M - Beauty and Skincare store</span>. Todos los derechos reservados.
          </p>
          <p style={{ 
            margin: '8px 0 0 0',
            fontSize: '12px',
            color: '#999'
          }}>
            Los precios incluyen IVA • Envíos a todo el país
          </p>
        </div>
        
        {/* Medios de pago */}
        <div style={{
          marginTop: '15px',
          paddingTop: '15px',
          borderTop: '1px solid #f0f0f0'
        }}>
          <div style={{
            fontSize: '12px',
            color: '#888',
            marginBottom: '8px'
          }}>
            Medios de pago:
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '20px'
          }}>
            <span>💳</span>
            <span>🏦</span>
            <span>🤝</span>
            <span>💰</span>
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
          
          .enlaces {
            gap: 15px !important;
            font-size: 13px !important;
          }
          
          .contacto {
            font-size: 13px !important;
          }
        }
        
        @media (max-width: 480px) {
          footer {
            padding: 15px 10px !important;
          }
          
          .enlaces {
            flex-direction: column !important;
            gap: 10px !important;
            align-items: center !important;
          }
          
          .enlaces a {
            width: 80% !important;
            text-align: center !important;
            padding: 8px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;