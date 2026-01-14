import Head from 'next/head';
import Layout from '../components/Layout';

const PreguntasFrecuentes = () => {
  return (
    <>
      <Head>
        <title>Preguntas Frecuentes | M&M Beauty Store</title>
        <meta name="description" content="Respuestas a las preguntas más frecuentes sobre nuestra tienda de belleza." />
      </Head>

      <div className="faq-page">
        <div className="faq-container">
          {/* SECCIÓN INTRODUCTORIA */}
          <div className="intro-section">
            <h1 className="faq-title">Preguntas Frecuentes</h1>
            <p className="intro-text">
              Encontrá respuestas rápidas a las dudas más comunes sobre nuestros productos, envíos y servicios.
            </p>
          </div>

          {/* FAQ ITEMS - SIN ACORDEON */}
          <div className="faq-item">
            <div className="faq-question">
              <span>¿Quiénes somos?</span>
            </div>
            <div className="faq-answer">
              <p>
                Somos una tienda especializada en productos y accesorios de belleza. Te asesoramos para elegir
                el mejor producto o la mejor rutina que se adapte a tu piel.
              </p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>¿Los productos son originales?</span>
            </div>
            <div className="faq-answer">
              <p>Los productos son <strong>100% originales</strong>. Los obtenemos de páginas distribuidoras oficiales.</p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>¿Cuáles son las formas de pago?</span>
            </div>
            <div className="faq-answer">
              <ul>
                <li><strong>Transferencias</strong></li>
                <li><strong>Efectivo</strong> (solo en lugar de entrega)</li>
                <li><strong>Tarjetas de crédito</strong> vía MercadoPago (+10%)</li>
              </ul>
            </div>
          </div>

          {/* MAPA DE ENTREGAS */}
          <div className="faq-item map-section">
            <div className="faq-question">
              <span>Zona de Entregas 24h - Capital Federal</span>
            </div>
            <div className="faq-answer map-answer">
              <p><strong>¡Entregas en 24 horas por motomensajería!</strong></p>
              <div className="delivery-map-container">
                <iframe
                  src="https://www.google.com/maps/d/embed?mid=1lPS6-cKqFhrrg9n-HxgNrj7_1zk&hl=en_US&ehbc=2E312F"
                  width="100%"
                  height="400"
                  style={{border:0}}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="map-note">
                <strong>Nota:</strong> Si tu zona está en el mapa, tenés entrega en 24 horas hábiles.
              </p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>¿Cuál es el costo de envío?</span>
            </div>
            <div className="faq-answer">
              <p>Capital Federal: <strong>$5.000</strong>. Compras +<strong>$60.000</strong>: <strong>Gratis</strong>.</p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>¿Cómo se realizan los envíos?</span>
            </div>
            <div className="faq-answer">
              <p><strong>Capital:</strong> 24h motomensajería | <strong>Interior:</strong> Correo Argentino 3-7 días</p>
              <p>Avisamos por WhatsApp con seguimiento.</p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>¿Dónde recibo mi pedido?</span>
            </div>
            <div className="faq-answer">
              <p><strong>Sucursal</strong> o <strong>domicilio</strong>.</p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>¿Tienen envío gratis?</span>
            </div>
            <div className="faq-answer">
              <p><strong>Sí</strong>, compras mayores a <strong>$60.000</strong>.</p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>¿Puedo cambiar productos?</span>
            </div>
            <div className="faq-answer">
              <p>No se realizan cambios una vez realizado el pago.</p>
            </div>
          </div>

          <div className="faq-item">
            <div className="faq-question">
              <span>¿Hacen venta mayorista?</span>
            </div>
            <div className="faq-answer">
              <p>¡Sí! Consultá condiciones especiales:</p>
              <a href="https://wa.me/541122222222?text=Hola%20venta%20mayorista" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
                Consultar WhatsApp
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.446l-.232-.139-3.578-.321c-.039-.003-.062-.007-.084-.007l-.003-.001A9.87 9.87 0 0 1 1.799 10.53c0-5.446 4.418-9.864 9.877-9.864s9.877 4.418 9.877 9.864a9.824 9.824 0 0 1-2.786 6.946l-.395.347-.034.028z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* CONTENIDO FAQ - SIN INTERFERIR CON LAYOUT */
        .faq-page {
          padding: 40px 20px;
          max-width: 900px;
          margin: 0 auto;
          min-height: calc(100vh - 200px);
        }

        .faq-container {
          animation: fadeIn 0.6s ease-out;
        }

        .intro-section {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
          color: white;
          text-align: center;
          padding: 40px 30px;
          border-radius: 20px;
          margin-bottom: 40px;
          box-shadow: 0 10px 40px rgba(156, 39, 176, 0.2);
        }

        .faq-title {
          font-size: 2.5rem;
          margin: 0 0 1rem 0;
          font-weight: 700;
          color: white;
        }

        .intro-text {
          font-size: 1.1rem;
          opacity: 0.95;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .faq-item {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 12px;
          margin-bottom: 20px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
          transform: translateY(-2px);
          border-color: var(--primary);
        }

        .faq-question {
          padding: 24px 30px;
          font-size: 18px;
          font-weight: 600;
          background: linear-gradient(135deg, #fff 0%, #fdfbff 100%);
          transition: all 0.3s ease;
          user-select: none;
        }

        .faq-question:hover {
          background: linear-gradient(135deg, #fff 0%, #f8f5ff 100%);
          color: var(--primary);
        }

        .faq-answer {
          padding: 30px;
          background: #fafbff;
          border-top: 1px solid var(--border);
        }

        .map-section .faq-question {
          background: linear-gradient(135deg, #fff 0%, #e8f5e8 100%);
        }

        .delivery-map-container {
          background: #f8f9fa;
          border-radius: 12px;
          overflow: hidden;
          margin: 20px 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          border: 1px solid var(--border);
        }

        .map-note {
          background: #e8f5e8;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid var(--accent);
          font-size: 15px;
          margin-top: 15px;
        }

        .whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--accent);
          color: white;
          padding: 12px 24px;
          border-radius: 25px;
          font-weight: 600;
          text-decoration: none;
          margin-top: 12px;
          transition: all 0.3s ease;
        }

        .whatsapp-btn:hover {
          background: #128c7e;
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .faq-page { padding: 20px 15px; }
          .faq-title { font-size: 2rem; }
          .faq-question { padding: 20px; font-size: 16px; }
        }
      `}</style>
    </>
  );
};

export default PreguntasFrecuentes;