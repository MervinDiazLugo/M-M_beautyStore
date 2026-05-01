# M&M Beauty Store

Tienda online de productos de belleza con panel de administración, integración con MercadoLibre y pedidos por WhatsApp.

**Prod:** https://m-m-beautystore.vercel.app  
**Admin:** https://m-m-beautystore.vercel.app/admin

---

## Arquitectura

Proyecto único Next.js (Pages Router). Antes existían dos repos separados (`Shop` + `shop_api`); fueron consolidados en este repositorio.

```
Frontend público  →  /                        (catálogo, detalle de producto)
Panel admin       →  /admin/                  (productos, ventas, ML, rentabilidad)
API pública       →  /api/products, /api/items
API admin         →  /api/admin/*
API mantenimiento →  /api/maintenance/*
```

**Base de datos:** Supabase (PostgreSQL)  
**Documentación de endpoints:** [API.md](API.md)

---

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js (Pages Router) |
| UI | React 18, CSS-in-JS inline styles |
| DB | Supabase (PostgreSQL) |
| Charts | Recharts |
| Carousel | react-slick |
| Deploy | Vercel |

---

## Estructura del proyecto

```
src/
├── components/
│   ├── product/            # Galería, info, pricing, descripción, reel
│   ├── admin/              # Componentes del panel admin
│   ├── ProductCard.js
│   ├── SearchContext.js
│   ├── Layout.js
│   └── Footer.js
├── hooks/
│   └── useProduct.js       # Lógica de producto (qty, mayorista, WhatsApp link)
├── lib/
│   ├── supabase.js         # Cliente Supabase + constantes de negocio
│   ├── db.js               # Wrapper MongoDB-compatible sobre Supabase
│   ├── auth.js             # Validación security key (items/maintenance)
│   ├── apiAuth.js          # Validación API key admin
│   └── api.js              # Helpers fetch público (getProducts, getProductById)
├── pages/
│   ├── index.js            # Catálogo público
│   ├── product/[id].js     # Detalle de producto (SSR directo a DB)
│   ├── admin/
│   │   ├── index.js        # Dashboard
│   │   ├── products.js     # CRUD productos + edición de costos
│   │   ├── sales.js        # Ventas
│   │   ├── profitability.js# Rentabilidad por producto/período
│   │   └── ...
│   └── api/
│       ├── products/       # Proxy público con top_seller
│       ├── items/          # CRUD completo (requiere x-api-key para escritura)
│       ├── maintenance/    # health, import, ml-import, cleanup
│       └── admin/          # auth, products, sales, ml/*, profitability, users
└── styles/
    └── globals.css
```

---

## Constantes de negocio

Definidas en `src/lib/supabase.js`. Fuente única de verdad para toda la lógica financiera.

| Constante | Valor | Uso |
|-----------|-------|-----|
| `ML_COMMISSION_RATE` | `0.34` | Comisión ML sobre precio de venta |
| `ML_STORE_PRICE_FACTOR` | `0.9` | Precio tienda = precio ML × 0.9 |
| `DEFAULT_PACKAGING_COST` | `$1.000` | Costo de packaging por defecto |
| `MIN_MARGIN` | `0.20` | Margen mínimo objetivo (20%) |
| `TOP_SELLER_THRESHOLD` | `1.000` | Unidades vendidas para badge Top Venta |

---

## Instalación local

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Variables de entorno

Crear `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_URL=

# MercadoLibre OAuth
MERCADOLIBRE_CLIENT_ID=
MERCADOLIBRE_CLIENT_SECRET=
ML_REDIRECT_URI=https://m-m-beautystore.vercel.app/api/admin/ml/callback

# Seguridad (items y mantenimiento)
KEY_SECURITY_LIST=key1,key2

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

---

## Deploy (Vercel)

1. Conectar repositorio en vercel.com
2. Agregar todas las variables de entorno en Settings → Environment Variables
3. Deploy automático en push a `main`

---

## Integración MercadoLibre

El flujo OAuth completo vive en `/api/admin/ml/`:

1. `GET /api/admin/ml/auth` → genera URL de autorización
2. Usuario autoriza en ML → ML redirige a `ML_REDIRECT_URI`
3. `GET /api/admin/ml/callback` → guarda tokens en tabla `settings`
4. `POST /api/admin/ml/sync-items` → importa productos de la cuenta
5. `GET /api/admin/ml/sync-orders?year=&month=` → importa órdenes del mes
6. `GET /api/admin/ml/billing-summary?year=&month=` → trae cargos reales de facturación

Ver todos los endpoints en [API.md](API.md).
