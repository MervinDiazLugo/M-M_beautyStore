# M&M Beauty Store — API Reference

**Total:** 28 endpoints  
**Base URL (prod):** `https://m-m-beautystore.vercel.app`  
**DB:** Supabase (PostgreSQL)

---

## Autenticación

| Sistema | Aplica a | Mecanismo |
|---------|----------|-----------|
| `validateApiKey()` | Todos los `/api/admin/*` | Header `x-api-key`, key almacenada en tabla `settings` de Supabase |
| `validateSecurityKey()` | `/api/items` (POST/PUT/PATCH/DELETE), `/api/maintenance` (excepto GET health) | Header `x-api-key`, key en env var `KEY_SECURITY_LIST` |
| Sin auth | `/api/products` GET, `/api/items` GET, `/api/maintenance/health` | Público |

---

## Admin — Auth

### `POST /api/admin/auth/login`
Login con Supabase.

**Auth:** No  
**Body:**
```json
{ "email": "...", "password": "..." }
```
**Response:** `{ userId, email, token }`

---

## Admin — Productos

### `GET /api/admin/products`
Lista todos los productos con campos calculados.

**Auth:** Sí  
**Response:** Array de productos con `ml_fee`, `net_received`, `profit` calculados en base a `ml_price`, `cost`, `packaging_cost`.

---

### `GET /api/admin/products/:id`
Producto individual con precios sugeridos.

**Auth:** Sí  
**Response:** Producto + `suggested_price` (precio para margen 20%) + `minimum_price` (break-even).

---

### `PUT /api/admin/products/:id`
Actualización completa del producto.

**Auth:** Sí  
**Body:** Campos del producto (`cost`, `packaging_cost`, `price`, `ml_price`, etc.)

---

### `PATCH /api/admin/products/:id`
Actualización parcial del producto.

**Auth:** Sí  
**Body:** Solo los campos a actualizar.

---

### `POST /api/admin/products/ml-action`
Ejecuta una acción sobre la publicación en MercadoLibre.

**Auth:** Sí  
**Body:**
```json
{
  "action": "updateStatus" | "updatePrice",
  "productId": "...",
  "mlItemId": "MLA...",
  "price": 0,
  "status": "active" | "paused"
}
```
**Response:** `{ success, mlStatus? | mlPrice?, storePrice? }`

---

### `POST /api/admin/products/update-price`
Actualiza precio local y opcionalmente en ML.

**Auth:** Sí  
**Body:**
```json
{ "id": "...", "price": 0, "updateMl": true }
```
**Response:** `{ success, updatedPrice, mlUpdated, mlError? }`

---

## Admin — Ventas

### `GET /api/admin/sales`
Lista todas las ventas con producto enriquecido.

**Auth:** Sí  
**Response:** Array de ventas con `product_name`, `cost`, `packaging_cost`, `ml_fee`, `profit` calculados.

---

### `POST /api/admin/sales`
Crea una venta manual.

**Auth:** Sí  
**Body:**
```json
{
  "product_id": "...",
  "sale_price": 0,
  "quantity": 1,
  "ml_order_id": "..." 
}
```

---

### `PUT /api/admin/sales/:id`
Edita una venta existente.

**Auth:** Sí  
**Body:** `product_id`, `sale_price`, `quantity`, `ml_order_id`

---

### `DELETE /api/admin/sales/:id`
Elimina una venta.

**Auth:** Sí

---

## Admin — Rentabilidad

### `GET /api/admin/profitability`
Dashboard de rentabilidad por producto y período.

**Auth:** Sí  
**Query params:**
- `year` + `month` — mes específico (ej: `year=2026&month=5`)
- `timeFilter` — `7d` | `30d` | `90d` | `all`

**Response:**
```json
{
  "summary": {
    "totalRevenue": 0,
    "totalProfit": 0,
    "avgMargin": 0,
    "totalUnits": 0,
    "totalSales": 0,
    "mlFees": 0,
    "productCosts": 0,
    "mlCharges": 0,
    "mlChargesData": null
  },
  "products": [
    {
      "id": "...",
      "title": "...",
      "sales": 0,
      "revenue": 0,
      "mlFeesTotal": 0,
      "costs": 0,
      "profit": 0,
      "margin": 0,
      "projectedMargin": 0,
      "suggestedPrice": 0,
      "minimumPrice": 0,
      "needsAdjustment": false,
      "marginStatus": "ok" | "low" | "negative",
      "projectedMarginStatus": "ok" | "low" | "negative"
    }
  ]
}
```

**Nota sobre cargos ML:** Cuando se usa filtro por mes y existen datos en `ml_monthly_charges`, las comisiones reales (CVFV/CVFN/CVFF) reemplazan las calculadas (34%). Los cargos adicionales (publicidad, suscripción, etc.) se descuentan del profit total.

---

## Admin — MercadoLibre

### `GET /api/admin/ml/auth`
Genera URL de autorización OAuth para conectar cuenta ML.

**Auth:** Sí  
**Response:** `{ authUrl: "https://auth.mercadolibre.com.ar/..." }`

---

### `GET /api/admin/ml/callback`
Callback OAuth. Recibe `code` de ML, guarda tokens en DB.

**Auth:** Sí  
**Query:** `code` (provisto por ML automáticamente)  
**Side effect:** Guarda `ml_access_token`, `ml_refresh_token`, `ml_token_expires_at`, `ml_user_id` en tabla `settings`.

---

### `GET /api/admin/ml/status`
Verifica si la cuenta ML está conectada.

**Auth:** Sí  
**Response:** `{ connected: boolean }`

---

### `POST /api/admin/ml/disconnect`
Revoca tokens y desconecta la cuenta ML.

**Auth:** Sí  
**Response:** `{ success: true }`

---

### `POST /api/admin/ml/refresh-token`
Renueva access token expirado usando el refresh token.

**Auth:** Sí  
**Response:** `{ success: true, expires_in: 21600 }`

---

### `POST /api/admin/ml/sync-items`
Importa todos los productos de la cuenta ML y los guarda en DB.

**Auth:** Sí  
**Comportamiento:** Preserva `cost`, `packaging_cost`, `instagram_reel` existentes.  
**Response:** `{ success, imported, failed, total, errors }`

---

### `GET /api/admin/ml/sync-orders`
Importa órdenes pagadas de ML para un mes dado.

**Auth:** Sí  
**Query:** `year`, `month`  
**Response:** `{ imported, skipped, matched, notPaid, totalProcessed, period }`

---

### `POST /api/admin/ml/sync-sales`
Sincroniza ventas desde órdenes ML hacia la tabla `sales`.

**Auth:** Sí  
**Response:** `{ success, imported, skipped, total }`

---

### `POST /api/admin/ml/import-sales`
Importa ventas desde array de órdenes provisto en el body.

**Auth:** Sí  
**Body:** `{ orders: [...] }`  
**Response:** `{ success, imported, skipped, matched }`

---

### `GET /api/admin/ml/billing-summary`
Trae cargos mensuales reales de ML y los cachea en `ml_monthly_charges`.

**Auth:** Sí  
**Query:** `year`, `month`, `refresh` (opcional, fuerza re-fetch)  
**Response:**
```json
{
  "period": "2026-05",
  "totalCharges": 0,
  "totalBonuses": 0,
  "netBalance": 0,
  "charges": [
    { "type": "CVFV", "label": "Comisión venta envío gratis", "amount": 0 },
    { "type": "CVFN", "label": "Comisión venta normal", "amount": 0 },
    { "type": "CVFF", "label": "Comisión venta full", "amount": 0 }
  ],
  "savedAt": "..."
}
```

**Tipos de cargos ML:**
| Código | Descripción |
|--------|-------------|
| CVFV | Comisión por venta — Envío Gratis / Flex |
| CVFN | Comisión por venta — Normal |
| CVFF | Comisión por venta — Full (stock en depósito ML) |

---

### `GET /api/admin/ml/shipments`
Lista envíos activos con producto, comprador y tracking.

**Auth:** Sí  
**Response:** Array de envíos.

---

### `GET /api/admin/ml/debug`
Diagnóstico completo de la conexión ML.

**Auth:** Sí  
**Response:** Tokens, user info, órdenes recientes, conteo de ventas en DB.

---

### `POST /api/admin/ml/sync`
Sync maestro. ⚠️ Actualmente retorna temprano con datos de debug — no ejecuta el sync completo.

**Auth:** Sí

---

## Admin — Usuarios

### `GET /api/admin/users`
Lista todos los usuarios del sistema.

**Auth:** Sí  
**Response:** Array de `{ id, email, created_at }`

---

### `POST /api/admin/users`
Crea un nuevo usuario.

**Auth:** Sí  
**Body:** `{ email, password }`

---

### `DELETE /api/admin/users/:id`
Elimina usuario por ID.

**Auth:** Sí

---

## Público — Productos

### `GET /api/products`
Lista todos los productos publicados para el frontend.

**Auth:** No  
**Response:** Array de productos con `top_seller: boolean` (calculado según `TOP_SELLER_THRESHOLD = 1000` ventas).

---

### `GET /api/products/:id`
Producto individual con `top_seller`.

**Auth:** No

---

## Público — Items (legacy, equivalente a /api/products)

### `GET /api/items`
Igual que `GET /api/products`.

**Auth:** No

### `POST /api/items`
Crea un producto.

**Auth:** Sí (security key)  
**Body:** Objeto producto con `id` requerido.

### `GET /api/items/:id`
Igual que `GET /api/products/:id`.

**Auth:** No

### `PUT /api/items/:id`
Reemplaza producto completo. Preserva `instagramReel` si no viene en el body.

**Auth:** Sí (security key)

### `PATCH /api/items/:id`
Actualización parcial.

**Auth:** Sí (security key)

### `DELETE /api/items/:id`
Elimina producto.

**Auth:** Sí (security key)

---

## Mantenimiento

### `GET /api/maintenance/health`
Estado de la base de datos.

**Auth:** No  
**Response:**
```json
{
  "status": "healthy",
  "database": {
    "totalDocuments": 0,
    "readableDocuments": 0,
    "corruptDocuments": 0,
    "sampleFieldCount": 0
  },
  "timestamp": "..."
}
```

---

### `DELETE /api/maintenance/cleanup`
⚠️ **Destructivo.** Elimina todos los productos de la DB.

**Auth:** Sí (security key)  
**Response:** `{ success, message }`

---

### `POST /api/maintenance/import`
Importa array de productos (upsert por `id`).

**Auth:** Sí (security key)  
**Body:** `{ data: [...productos] }` o array directo  
**Response:** `{ success, stats: { total, upserted, modified } }`

---

### `POST /api/maintenance/ml-import`
Scrapea productos desde ML por IDs y los guarda en DB.

**Auth:** Sí (security key)  
**Requires:** `MERCADOLIBRE_CLIENT_ID`, `MERCADOLIBRE_CLIENT_SECRET` en env  
**Body:**
```json
{ "ids": ["MLA1510055959", "MLA1519662745"] }
```
**Comportamiento:**
- Obtiene token OAuth de ML (client_credentials)
- Scrapea datos de cada item: título, precio, imágenes, specs, vendidas, descripción
- Procesa lotes de 5 concurrentes con 200ms de delay entre lotes
- Preserva `instagramReel` existente
- Calcula automáticamente: `price` (neto), `precio_mayorista`, `cantidad_minima_mayorista`, `envioGratis`

**Response:**
```json
{
  "success": true,
  "message": "Importación completada: X/Y productos",
  "results": {
    "total": 0,
    "success": 0,
    "failed": 0,
    "upserted": 0,
    "modified": 0,
    "errors": [],
    "products": [...]
  }
}
```

---

## Schema de Producto

Estructura completa del objeto producto en DB:

```json
{
  "id": "MLA1510055959",
  "name": "Serum De Pestañas",
  "ml_price": 7105,
  "price": 6114,
  "precio_mayorista": 4891,
  "cantidad_minima_mayorista": 18,
  "cantidad_vendida": 1043,
  "sold_quantity_real": 118,
  "desc": "Descripción corta del producto",
  "sku": "MLA1510055959",
  "image": ["https://http2.mlstatic.com/D_NQ_NP_...jpg"],
  "envio_gratis": false,
  "description": "Descripción completa del producto",
  "features": ["Hidratante", "Sin parabenos"],
  "specifications": {
    "Marca": "Bioaqua",
    "Modelo": "Serum de pestañas",
    "Tipo de piel": "Todo tipo"
  },
  "mercado_libre_url": "https://www.mercadolibre.com.ar/MLA...",
  "brand": "Bioaqua",
  "condition": "new",
  "sold_quantity": 1043,
  "available_quantity": 9,
  "published": true,
  "permalink": "https://articulo.mercadolibre.com.ar/MLA...",
  "instagram_reel": "https://www.instagram.com/reel/...",
  "cost": 2500,
  "packaging_cost": 1000,
  "ml_item_id": "MLA1510055959"
}
```

**Campos calculados (no guardados en DB, devueltos por las APIs):**

| Campo | Dónde aparece | Cálculo |
|-------|--------------|---------|
| `top_seller` | `/api/products`, `/api/items` | `cantidad_vendida > 1000` |
| `ml_fee` | `/api/admin/products` | `ml_price × 0.34` |
| `net_received` | `/api/admin/products` | `ml_price - ml_fee` |
| `profit` | `/api/admin/products` | `net_received - cost - packaging_cost` |
| `suggested_price` | `/api/admin/products/:id` | `(cost + packaging) / (1 - 0.34 - 0.20)` |
| `minimum_price` | `/api/admin/products/:id` | `(cost + packaging) / (1 - 0.34)` |

---

## Ejemplos de uso

### Importar productos desde MercadoLibre
```bash
curl -X POST https://m-m-beautystore.vercel.app/api/maintenance/ml-import \
  -H "Content-Type: application/json" \
  -H "x-api-key: TU_KEY" \
  -d '{"ids":["MLA1510055959","MLA1519662745"]}'
```

### Crear producto manualmente
```bash
curl -X POST https://m-m-beautystore.vercel.app/api/items \
  -H "Content-Type: application/json" \
  -H "x-api-key: TU_KEY" \
  -d '{"id":"MLA123","name":"Producto","price":5000,"sku":"MLA123","published":true}'
```

### Actualizar producto parcialmente
```bash
curl -X PATCH https://m-m-beautystore.vercel.app/api/items/MLA123 \
  -H "Content-Type: application/json" \
  -H "x-api-key: TU_KEY" \
  -d '{"instagram_reel":"https://www.instagram.com/reel/..."}'
```

### Verificar salud de la DB
```bash
curl https://m-m-beautystore.vercel.app/api/maintenance/health
```

### Importar órdenes ML del mes
```bash
curl "https://m-m-beautystore.vercel.app/api/admin/ml/sync-orders?year=2026&month=5" \
  -H "x-api-key: TU_KEY_ADMIN"
```

---

## Constantes de negocio

Definidas en `src/lib/supabase.js`:

| Constante | Valor | Uso |
|-----------|-------|-----|
| `ML_COMMISSION_RATE` | `0.34` | Comisión ML sobre precio de venta |
| `ML_STORE_PRICE_FACTOR` | `0.9` | Precio tienda = precio ML × 0.9 |
| `DEFAULT_PACKAGING_COST` | `$1.000` | Costo packaging por defecto |
| `MIN_MARGIN` | `0.20` | Margen mínimo objetivo (20%) |
| `TOP_SELLER_THRESHOLD` | `1.000` | Unidades vendidas para badge "Top Venta" |

---

## Variables de entorno requeridas

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_URL=

# MercadoLibre
MERCADOLIBRE_CLIENT_ID=
MERCADOLIBRE_CLIENT_SECRET=
ML_REDIRECT_URI=https://m-m-beautystore.vercel.app/api/admin/ml/callback

# Auth
KEY_SECURITY_LIST=key1,key2

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=
```
