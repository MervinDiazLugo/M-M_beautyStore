# M&M Beauty Store - Tienda Online

Tienda en línea de productos de belleza y cuidado personal con integración de WhatsApp para pedidos.

## Características

- 🛍️ Catálogo de productos con búsqueda y filtrado
- 🔍 Búsqueda en tiempo real con debounce
- 📱 Diseño responsive (mobile-first)
- 💬 Pedidos por WhatsApp
- 🌐 Integración con API externa para gestión de productos

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **UI:** React 18 con componentes styled
- **Estado:** React Context API + useState
- **API:** Integración con API REST

## Requisitos externa

- Node.js 18+
- npm o yarn

## Instalación

```bash
npm install
```

## Desarrollo Local

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

## Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://m-m-beauty-store-api.vercel.app
NEXT_PUBLIC_API_KEY=tu_api_key_aqui
```

### Variables disponibles

| Variable | Descripción | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | URL base de la API de productos | Sí |
| `NEXT_PUBLIC_API_KEY` | Clave de API para endpoints protegidos | Solo para escritura |

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── product/        # Componentes de página de producto
│   │   ├── ImageGallery.js
│   │   ├── ProductInfo.js
│   │   ├── PricingCard.js
│   │   └── ...
│   ├── ProductCard.js
│   ├── Footer.js
│   ├── Layout.js
│   └── SearchContext.js
├── hooks/
│   └── useProduct.js  # Hook para datos de producto
├── lib/
│   └── api.js         # Utilidades API
├── pages/
│   ├── api/           # Rutas API internas
│   │   └── products/
│   ├── product/
│   │   └── [id].js    # Página de detalle de producto
│   ├── index.js       # Página principal
│   └── ...
└── styles/
    └── globals.css
```

## Integración con API Externa

### Endpoints Consumidos

- `GET /api/items` - Lista todos los productos
- `GET /api/items/:id` - Obtiene un producto por ID

### Formato de Datos

La API externa devuelve datos en camelCase. El cliente normaliza a snake_case:

```javascript
// API retorna:
{ id: "MLA123", name: "Producto", mlPrice: 1000 }

// Normalizado a:
{ id: "MLA123", name: "Producto", ml_price: 1000 }
```

### Página de Producto

Usa `getServerSideProps` para obtener datos del producto desde la API.

### Página Principal

Carga productos desde la API en el cliente usando `useEffect` y `fetch`.

## Deployment

### Vercel (Recomendado)

1. Conectar repositorio en [vercel.com](https://vercel.com)
2. Agregar variables de entorno en Settings → Environment Variables:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_API_KEY`
3. Deploy automático en push a main

### Variables para Production

```env
NEXT_PUBLIC_API_URL=https://m-m-beauty-store-api.vercel.app
```

## Licencia

MIT
