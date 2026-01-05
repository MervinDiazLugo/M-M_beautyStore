import Head from 'next/head';

const PreguntasFrecuentes = () => {
  return (
    <>
      <Head>
        <title>Preguntas Frecuentes | M&M Beauty Store</title>
        <meta name="description" content="Respuestas a las preguntas más frecuentes sobre nuestra tienda de belleza." />
      </Head>

      <main className="faq-content">
        <div className="faq-container">
          {/* TÍTULO - REDUCIDO ESPACIO */}
          <div className="intro-section">
            <h1 className="faq-title">Preguntas Frecuentes</h1>
            <p className="intro-text">Respuestas rápidas sobre productos y servicios</p>
          </div>

          {/* 1. QUIÉNES SOMOS + WHATSAPP */}
          <div className="faq-section">
            <h2 className="question">¿Quiénes somos?</h2>
            <div className="answer">
              <p>Somos una tienda especializada en productos y accesorios de belleza. Te asesoramos para elegir el mejor producto o rutina que se adapte a tu piel.</p>
              <a href="https://wa.me/5491123942598?text=Hola%20quiero%20saber%20más%20sobre%20ustedes" 
                 className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.446l-.232-.139-3.578-.321c-.039-.003-.062-.007-.084-.007l-.003-.001A9.87 9.87 0 0 1 1.799 10.53c0-5.446 4.418-9.864 9.877-9.864s9.877 4.418 9.877 9.864a9.824 9.824 0 0 1-2.786 6.946l-.395.347-.034.028z"/>
                </svg>
                Consultar Ahora
              </a>
            </div>
          </div>

          {/* 2. PRODUCTOS ORIGINALES */}
          <div className="faq-section">
            <h2 className="question">¿Los productos son originales?</h2>
            <p className="answer"><strong>SÍ, 100% originales.</strong> Los obtenemos distribuidoras oficiales.</p>
          </div>

          {/* 3. FORMAS DE PAGO */}
          <div className="faq-section">
            <h2 className="question">¿Cuáles son las formas de pago?</h2>
            <div className="answer">
              <ul>
                <li><strong>Transferencias bancarias</strong></li>
                <li><strong>Efectivo</strong> (solo en lugar de entrega)</li>
                <li><strong>Tarjetas de crédito</strong> vía MercadoPago <strong>(+10%)</strong></li>
              </ul>
            </div>
          </div>

          {/* 4. MAPA */}
          <div className="faq-section map-section">
            <h2 className="question">Zona de entregas 24 horas</h2>
            <div className="answer">
              <p><strong>Entregas en 24 horas por motomensajería</strong> en Capital Federal</p>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/d/embed?mid=1lPS6-cKqFhrrg9n-HxgNrj7_1zk&hl=en_US&ehbc=2E312F"
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="map-info">Si tu zona está marcada → Entrega en 24 horas</div>
            </div>
          </div>

          <div className="faq-section">
            <h2 className="question">¿Cuál es el costo de envío?</h2>
            <div className="answer">
              <div className="pricing-grid">
                <div className="price-item">
                  <span className="price">$5.000</span>
                  <span>Capital Federal</span>
                </div>
                <div className="price-item free">
                  <span className="price">GRATIS</span>
                  <span>+$60.000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="faq-section">
            <h2 className="question">¿Cómo se realizan los envíos?</h2>
            <div className="answer">
              <div className="shipping-options">
                <div className="option"><strong>Capital:</strong> 24hs motomensajería</div>
                <div className="option"><strong>Interior:</strong> Correo Argentino 3-7 días</div>
              </div>
            </div>
          </div>

          <div className="faq-section">
            <h2 className="question">¿Dónde recibo mi pedido?</h2>
            <p className="answer"><strong>Sucursal</strong> o <strong>domicilio</strong></p>
          </div>

          <div className="faq-section highlight-section">
            <h2 className="question">¿Envío gratis?</h2>
            <p className="answer highlight">✅ <strong>SÍ - Compras +$60.000</strong></p>
          </div>

          <div className="faq-section">
            <h2 className="question">¿Cambios?</h2>
            <p className="answer no-changes">No se realizan cambios tras el pago</p>
          </div>

          <div className="faq-section">
            <h2 className="question">¿Venta mayorista?</h2>
            <div className="answer">
              <p><strong>¡SÍ!</strong> Consultanos:</p>
              <a href="https://wa.me/5491123942598?text=Hola%20quiero%20consultar%20por%20venta%20mayorista" 
                 className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.446l-.232-.139-3.578-.321c-.039-.003-.062-.007-.084-.007l-.003-.001A9.87 9.87 0 0 1 1.799 10.53c0-5.446 4.418-9.864 9.877-9.864s9.877 4.418 9.877 9.864a9.824 9.824 0 0 1-2.786 6.946l-.395.347-.034.028z"/>
                </svg>
                Consultar Mayorista
              </a>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .faq-content {
          padding: 12px;
          max-width: 900px;
          margin: 0 auto;
        }

        .faq-container {
          animation: fadeIn 0.5s ease-out;
        }

        .intro-section {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          text-align: center;
          padding: 20px 15px;
          border-radius: 12px;
          margin-bottom: 15px;
        }

        .faq-title {
          font-size: 1.4rem;
          margin: 0 0 4px 0;
          font-weight: 600;
        }

        .intro-text {
          font-size: 0.9rem;
          opacity: 0.9;
          margin: 0;
        }

        .faq-section {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .question {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--primary);
          margin: 0 0 8px 0;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--border);
        }

        .answer {
          font-size: 0.88rem;
          line-height: 1.55;
          color: #374151;
          margin: 0;
        }

        .answer p {
          margin-bottom: 8px;
        }

        .map-section {
          border-color: var(--accent);
        }

        .map-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          margin: 12px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .map-info {
          background: var(--accent);
          color: white;
          padding: 10px;
          border-radius: 6px;
          text-align: center;
          font-size: 0.82rem;
          margin-top: 10px;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 12px 0;
        }

        .price-item {
          padding: 12px;
          border-radius: 8px;
          text-align: REDACTED;
          border: 1px solid var(--border);
          background: white;
        }

        .price-item.free {
          border-color: var(--accent);
          background: #f0fdf4;
        }

        .price {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }

        .shipping-options {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin: 10px 0;
          background: white;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }

        .option {
          font-size: 0.82rem;
          padding: 6px;
          background: #f8fafc;
          border-radius: 6px;
        }

        .highlight {
          font-size: 0.95rem;
          color: #059669;
          font-weight: 600;
          padding: 12px;
          background: white;
          border-radius: 8px;
          border-left: 4px solid var(--accent);
        }

        .no-changes {
          color: #dc2626;
          background: #fef2f2;
          padding: 10px;
          border-radius: 6px;
          border-left: 4px solid #dc2626;
          font-weight: 500;
        }

        .whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          padding: 10px 16px;
          border-radius: 18px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          margin-top: 8px;
          box-shadow: 0 3px 10px rgba(37, 211, 102, 0.3);
        }

        .whatsapp-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.4);
        }

        ul { padding-left: 18px; margin: 8px 0; }
        li { font-size: 0.88rem; margin-bottom: 4px; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .faq-content { padding: 10px; }
          .faq-title { font-size: 1.25rem; }
          .question { font-size: 1rem; }
          .pricing-grid { grid-template-columns: 1fr; }
          .map-container iframe { height: 280px; }
        }
      `}</style>
    </>
  );
};

export default PreguntasFrecuentes;
