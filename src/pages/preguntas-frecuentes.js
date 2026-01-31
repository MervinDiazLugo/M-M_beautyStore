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
          {/* TÍTULO */}
          <div className="intro-section">
            <h1 className="faq-title" style={{ color: 'white' }}>Preguntas Frecuentes</h1>
            <p className="intro-text">Respuestas rápidas sobre productos y servicios</p>
          </div>

          {/* QUIÉNES SOMOS */}
          <div className="faq-section">
            <h2 className="question">¿Quiénes somos?</h2>
            <div className="answer">
              <p>Somos una tienda especializada en productos y accesorios de belleza. Te asesoramos para elegir el mejor producto o rutina que se adapte a tu piel.</p>
              <a
                href="https://wa.me/5491123942598?text=Hola%2C%20tengo%20una%20consulta%20sobre%20un%20producto%20de%20la%20tienda"
                className="whatsapp-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.446l-.232-.139-3.578-.321c-.039-.003-.062-.007-.084-.007l-.003-.001A9.87 9.87 0 0 1 1.799 10.53c0-5.446 4.418-9.864 9.877-9.864s9.877 4.418 9.877 9.864a9.824 9.824 0 0 1-2.786 6.946l-.395.347-.034.028z" />
                </svg>
                Contactar por WhatsApp
              </a>
            </div>
          </div>

          {/* PRODUCTOS ORIGINALES */}
          <div className="faq-section">
            <h2 className="question">¿Los productos son originales?</h2>
            <p className="answer"><strong>SÍ, 100% originales.</strong> Los obtenemos de distribuidoras oficiales.</p>
          </div>

          {/* FORMAS DE PAGO */}
          <div className="faq-section">
            <h2 className="question">¿Cuáles son las formas de pago?</h2>
            <div className="answer">
              <ul>
                <li>Transferencias bancarias</li>
                <li>Efectivo (solo en lugar de entrega)</li>
                <li>Tarjetas de crédito vía MercadoPago (+10%)</li>
              </ul>
            </div>
          </div>

          {/* MAPA + ZONAS */}
          <div className="faq-section map-section">
            <h2 className="question">Zonas de entrega rápida (motomensajería)</h2>
            <div className="answer">
              <p><strong>Entregas en 24 horas</strong> en CABA y zonas cercanas del GBA (según zona).</p>

              <div className="color-legend">
                <div><span className="color-box caba"></span> CABA</div>
                <div><span className="color-box norte"></span> Zona Norte</div>
                <div><span className="color-box oeste"></span> Zona Oeste</div>
                <div><span className="color-box sur"></span> Zona Sur</div>
              </div>

              <div className="map-container">
                <img
                  src="/mapa_.jpg"
                  alt="Mapa de zonas de entrega rápida - M&M Beauty Store"
                  className="map-image"
                  loading="lazy"
                />
              </div>

              <div className="zones-list">
                <strong>Zonas incluidas:</strong>
                <ul>
                  <li><strong>CABA</strong>: Toda la Ciudad Autónoma de Buenos Aires.</li>
                  <li><strong>Zona Norte</strong>: Escobar, Pilar, Tigre, San Isidro, Vicente López, San Fernando, Malvinas Argentinas, José C. Paz, San Miguel (parte), etc.</li>
                  <li><strong>Zona Oeste</strong>: Moreno, Merlo, Morón, Ituzaingó, Hurlingham, Marcos Paz, General Rodríguez, etc.</li>
                  <li><strong>Zona Sur</strong>: Lomas de Zamora, Quilmes, Almirante Brown, Lanús, Avellaneda, Berazategui, Florencio Varela, Ezeiza, Presidente Perón, San Vicente, etc.</li>
                </ul>
              </div>

              <div className="map-info">Si tu zona está marcada → Entrega en 24 horas (consultar por WhatsApp)</div>
            </div>
          </div>

          {/* COSTO DE ENVÍO + ENVÍO GRATIS */}
          <div className="faq-section">
            <h2 className="question">¿Cuál es el costo de envío?</h2>
            <div className="answer">
              <div className="shipping-cost-cards">
                <div className="cost-card">
                  <div className="cost-amount">$6.000</div>
                  <div className="cost-zone">CABA + Zona Norte</div>
                </div>
                <div className="cost-card">
                  <div className="cost-amount">$12.000</div>
                  <div className="cost-zone">Zona Oeste + Zona Sur</div>
                </div>
              </div>

              <div className="free-shipping-promo">
                <div className="promo-header">
                  <svg 
                    className="promo-icon-svg" 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="20 12 20 22 4 22 4 12"></polyline>
                    <rect x="2" y="7" width="20" height="5"></rect>
                    <line x1="12" y1="18" x2="12" y2="15"></line>
                    <path d="M12 15l-4-4h8l-4 4z"></path>
                  </svg>
                  <span className="promo-title">Envío GRATIS</span>
                </div>

                <ul className="free-bullets">
                  <li>
                    En compras superiores a <strong>$60.000</strong>
                    <span className="bullet-zone">para CABA y Zona Norte</span>
                  </li>
                  <li>
                    En compras superiores a <strong>$100.000</strong>
                    <span className="bullet-zone">para Zona Oeste y Zona Sur</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CÓMO SE REALIZAN LOS ENVÍOS */}
          <div className="faq-section">
            <h2 className="question">¿Cómo se realizan los envíos?</h2>
            <div className="answer">
              <div className="shipping-options">
                <div className="option">
                  <strong>CABA + Zona Norte:</strong> 24 hs motomensajería
                </div>
                <div className="option">
                  <strong>Zona Oeste + Zona Sur:</strong> 24-48 hs motomensajería (consultar)
                </div>
                <div className="option">
                  <strong>Interior del país:</strong> Correo Argentino 3-7 días
                </div>
              </div>
            </div>
          </div>

          {/* DÓNDE RECIBO */}
          <div className="faq-section">
            <h2 className="question">¿Dónde recibo mi pedido?</h2>
            <p className="answer"><strong>Sucursal</strong> o <strong>domicilio</strong></p>
          </div>

          {/* CAMBIOS */}
          <div className="faq-section">
            <h2 className="question">¿Cambios o devoluciones?</h2>
            <p className="answer no-changes">No se realizan cambios ni devoluciones tras el pago</p>
          </div>

          {/* 🔥 MODIFICADO: VENTA MAYORISTA (INFORMACIÓN AMPLIADA) */}
          <div className="faq-section majorista-section">
            <h2 className="question">¿Venta mayorista?</h2>
            <div className="answer">
              <div className="majorista-info">
                <p><strong>¡Sí! Tenemos condiciones especiales para revendedoras/es.</strong></p>
                
                <div className="majorista-benefits">
                  <div className="benefit-card">
                    <div className="benefit-icon">🏪</div>
                    <div className="benefit-content">
                      <h3>Cantidad Mínima</h3>
                      <p>Ver en la pagína de detalle de cada producto para ver la cantidad mínima requerida para acceder al precio mayorista</p>
                    </div>
                  </div>
                  
                  <div className="benefit-card">
                    <div className="benefit-icon">💰</div>
                    <div className="benefit-content">
                      <h3>Precios Especiales</h3>
                      <p>Descuentos significativos vs. precio minorista (ej: -20% o más)</p>
                    </div>
                  </div>
                  
                  <div className="benefit-card">
                    <div className="benefit-icon">🚚</div>
                    <div className="benefit-content">
                      <h3>Envío Gratis</h3>
                      <p><strong>ENVÍO GRATIS automático</strong> para todas las compras al por mayor</p>
                    </div>
                  </div>
                  
                  <div className="benefit-card">
                    <div className="benefit-icon">💬</div>
                    <div className="benefit-content">
                      <h3>Atención Personalizada</h3>
                      <p>Asesoramiento directo para optimizar tu stock y ganancias</p>
                    </div>
                  </div>
                </div>
                
                <div className="majorista-process">
                  <h3>Proceso de Compra Mayorista</h3>
                  <ol>
                    <li><strong>Selección de cantidad:</strong> Elige las unidades minimas para darte el precio mayorista del producto deseado</li>
                    <li><strong>Precio automático:</strong> Al alcanzar el mínimo, se aplica el precio mayorista automáticamente</li>
                    <li><strong>Visualización en tiempo real:</strong> Barra de progreso que muestra cuánto falta para mayorista</li>
                    <li><strong>Generación de mensaje:</strong> WhatsApp con información correcta (mayorista/minorista)</li>
                    <li><strong>Confirmación de pedido:</strong> Contacto directo para coordinar envío y pago</li>
                  </ol>
                </div>
                
                <div className="payment-condition">
                  <div className="payment-icon">⚠️</div>
                  <div className="payment-content">
                    <h3>Condición de Pago para Mayoristas</h3>
                    <p><strong>TODAS LAS COMPRAS AL MAYOR REQUIEREN 50% DE SEÑA AL MOMENTO DEL PEDIDO</strong></p>
                    <p>El 50% restante se abona al momento de la entrega o según acuerdo con el vendedor</p>
                  </div>
                </div>
                
                <div className="comparison-benefit">
                  <h3>Ahorro vs. MercadoLibre</h3>
                  <p>Calculamos automáticamente cuánto ahorras por unidad comparando nuestro precio mayorista vs. el precio en MercadoLibre</p>
                </div>
                
                <div className="whatsapp-majorista">
                  <a
                    href="https://wa.me/5491123942598?text=Hola%20quiero%20consultar%20por%20venta%20mayorista"
                    className="whatsapp-btn majorista-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.446l-.232-.139-3.578-.321c-.039-.003-.062-.007-.084-.007l-.003-.001A9.87 9.87 0 0 1 1.799 10.53c0-5.446 4.418-9.864 9.877-9.864s9.877 4.418 9.877 9.864a9.824 9.824 0 0 1-2.786 6.946l-.395.347-.034.028z" />
                    </svg>
                    Consultar por Mayorista
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        :root {
          --primary: #6a1b9a;
          --primary-light: #9c27b0;
          --primary-dark: #4a148c;
          --accent: #ab47bc;
          --light-bg: #ffffff;
          --light-gray: #fafafa;
          --border: #e0e0e0;
          --text: #333333;
        }

        .faq-content {
          padding: 24px 16px;
          max-width: 1100px;
          margin: 0 auto;
          background: var(--light-bg);
        }

        .faq-container {
          animation: fadeIn 0.6s ease-out;
        }

        .intro-section {
          background: linear-gradient(135deg, #7e57c2, #5e35b1);
          color: white;
          text-align: center;
          padding: 28px 20px;
          border-radius: 16px;
          margin-bottom: 28px;
          box-shadow: 0 4px 16px rgba(94, 53, 177, 0.12);
        }

        .faq-title {
          font-size: 1.7rem;
          margin: 0 0 8px;
          font-weight: 700;
        }

        .intro-text {
          font-size: 1.02rem;
          opacity: 0.92;
          margin: 0;
        }

        .faq-section {
          background: white;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 18px;
          box-shadow: 0 3px 12px rgba(0,0,0,0.04);
        }

        .majorista-section {
          border-left: 5px solid var(--accent);
        }

        .question {
          font-size: 1.18rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f0e8ff;
        }

        .majorista-section .question {
          color: var(--accent);
        }

        .answer {
          font-size: 0.95rem;
          line-height: 1.68;
          color: #444;
        }

        .majorista-info {
          margin-top: 15px;
        }

        .majorista-benefits {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin: 20px 0;
        }

        .benefit-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #f8f5ff, #f3e8ff);
          border-radius: 12px;
          border-left: 4px solid var(--accent);
          transition: transform 0.2s;
        }

        .benefit-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(171, 71, 188, 0.15);
        }

        .benefit-icon {
          font-size: 24px;
          flex-shrink: 0;
        }

        .benefit-content h3 {
          margin: 0 0 6px 0;
          font-size: 1rem;
          color: var(--primary-dark);
          font-weight: 700;
        }

        .benefit-content p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.5;
          color: #555;
        }

        .majorista-process {
          background: #f0f9ff;
          padding: 20px;
          border-radius: 12px;
          margin: 24px 0;
          border: 1px solid #bae6fd;
        }

        .majorista-process h3 {
          color: #0369a1;
          margin-top: 0;
          margin-bottom: 16px;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .majorista-process ol {
          margin: 0;
          padding-left: 20px;
        }

        .majorista-process li {
          margin-bottom: 10px;
          color: #374151;
          line-height: 1.5;
        }

        .majorista-process li strong {
          color: #0ea5e9;
        }

        .payment-condition {
          background: #fef3c7;
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 18px;
          margin: 24px 0;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .payment-icon {
          font-size: 32px;
          flex-shrink: 0;
        }

        .payment-content h3 {
          margin: 0 0 8px 0;
          color: #92400e;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .payment-content p {
          margin: 0;
          color: #92400e;
          line-height: 1.5;
        }

        .payment-content p:first-of-type {
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 8px;
        }

        .comparison-benefit {
          background: #dcfce7;
          border: 1px solid #86efac;
          border-radius: 12px;
          padding: 18px;
          margin: 20px 0;
        }

        .comparison-benefit h3 {
          color: #065f46;
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .comparison-benefit p {
          margin: 0;
          color: #065f46;
          line-height: 1.5;
        }

        .whatsapp-majorista {
          text-align: center;
          margin-top: 25px;
        }

        .majorista-btn {
          background: linear-gradient(135deg, #0ea5e9, #0284c7);
          box-shadow: 0 3px 12px rgba(14, 165, 233, 0.3);
        }

        .majorista-btn:hover {
          box-shadow: 0 6px 18px rgba(14, 165, 233, 0.4);
        }

        ul {
          list-style: none;
          padding-left: 0;
          margin: 12px 0;
        }

        ul li {
          position: relative;
          padding-left: 28px;
          margin-bottom: 10px;
          color: #555;
        }

        ul li::before {
          content: "•";
          position: absolute;
          left: 8px;
          color: var(--primary);
          font-size: 1.6rem;
          line-height: 1.1;
          top: -2px;
        }

        .whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          padding: 12px 22px;
          border-radius: 999px;
          font-size: 0.94rem;
          font-weight: 600;
          text-decoration: none;
          margin-top: 14px;
          box-shadow: 0 3px 12px rgba(37, 211, 102, 0.3);
          transition: all 0.22s;
        }

        .whatsapp-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37, 211, 102, 0.4);
        }

        .map-container {
          margin: 18px 0;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 14px rgba(0,0,0,0.08);
        }

        .map-image {
          width: 100%;
          height: auto;
          max-height: 460px;
          object-fit: contain;
        }

        .color-legend {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin: 14px 0;
          font-size: 0.88rem;
        }

        .color-box {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          display: inline-block;
        }

        .caba { background: #00bfff; }
        .norte { background: #90ee90; }
        .oeste { background: orange; }
        .sur { background: violet; }

        .map-info {
          background: var(--primary);
          color: white;
          padding: 12px 16px;
          border-radius: 10px;
          text-align: center;
          font-size: 0.88rem;
          margin-top: 14px;
        }

        .shipping-cost-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 32px;
        }

        .cost-card {
          padding: 20px 16px;
          background: linear-gradient(135deg, #ffffff, #f8f5ff);
          border: 1px solid #e0d4ff;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(106, 27, 154, 0.08);
          transition: transform 0.2s;
        }

        .cost-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(106, 27, 154, 0.12);
        }

        .cost-amount {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary);
          margin-bottom: 6px;
        }

        .cost-zone {
          font-size: 1rem;
          color: #555;
          font-weight: 500;
        }

        .free-shipping-promo {
          padding: 24px 20px;
          background: linear-gradient(135deg, #f8f5ff, #f3e8ff);
          border: 2px dashed var(--primary-light);
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 6px 20px rgba(106, 27, 154, 0.08);
          margin: 28px 0 12px;
        }

        .promo-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .promo-icon-svg {
          color: var(--primary);
          flex-shrink: 0;
        }

        .promo-title {
          font-size: 1.45rem;
          font-weight: 800;
          color: var(--primary);
        }

        .free-bullets {
          list-style: none;
          padding: 0;
          margin: 0 auto;
          max-width: 480px;
          text-align: left;
        }

        .free-bullets li {
          position: relative;
          padding-left: 32px;
          margin-bottom: 16px;
          font-size: 1.05rem;
          line-height: 1.5;
          color: #444;
        }

        .free-bullets li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--primary);
          font-size: 1.4rem;
          font-weight: bold;
          line-height: 1.5;
        }

        .free-bullets strong {
          color: var(--primary-dark);
          font-weight: 800;
        }

        .bullet-zone {
          display: block;
          font-size: 0.95rem;
          color: #666;
          margin-top: 2px;
        }

        .shipping-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 12px;
        }

        .option {
          padding: 12px 16px;
          background: #f9f9f9;
          border-radius: 10px;
          border-left: 4px solid var(--primary);
          font-size: 0.94rem;
        }

        .no-changes {
          color: #c62828;
          background: #ffebee;
          padding: 12px;
          border-radius: 8px;
          border-left: 4px solid #c62828;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .faq-content { padding: 16px 12px; max-width: 100%; }
          .shipping-cost-cards { grid-template-columns: 1fr; gap: 20px; }
          .free-bullets { text-align: center; }
          .free-bullets li { padding-left: 0; }
          .free-bullets li::before { display: none; }
          .bullet-zone { display: inline; margin-left: 6px; }
          .map-image { max-height: 360px; }
          .whatsapp-btn { width: 100%; justify-content: center; padding: 14px 24px; }
          .majorista-benefits { grid-template-columns: 1fr; }
          .payment-condition { flex-direction: column; align-items: center; text-align: center; }
          .payment-icon { margin-bottom: 8px; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default PreguntasFrecuentes;