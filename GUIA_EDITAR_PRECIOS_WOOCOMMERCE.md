# 💰 Guía Paso a Paso: Editar Precios en WooCommerce

## 🎯 Guía Visual para Administradores

Esta guía te muestra cómo editar precios de productos de forma fácil y rápida.

---

## 📍 Paso 1: Acceder al Panel de Administración

### 1.1 Abrir WordPress Admin

Abre tu navegador y ve a:

```
https://mediumpurple-dotterel-725437.hostingersite.com/wp-admin
```

### 1.2 Iniciar Sesión

- **Usuario:** Tu usuario de WordPress
- **Contraseña:** Tu contraseña de WordPress

```
┌─────────────────────────────────────────┐
│                                         │
│         🔐 Iniciar Sesión               │
│                                         │
│  Usuario:  [________________]           │
│                                         │
│  Contraseña: [________________]         │
│                                         │
│  [ ] Recuérdame                         │
│                                         │
│         [  Acceder  ]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 Paso 2: Ir a Productos

### 2.1 En el menú lateral izquierdo

Busca y haz click en:

```
┌─────────────────────────┐
│  📊 Escritorio          │
│  📝 Entradas            │
│  📄 Páginas             │
│  💬 Comentarios         │
│  🎨 Apariencia          │
│  🔌 Plugins             │
│  👥 Usuarios            │
│  ⚙️  Ajustes            │
│                         │
│  🛒 WooCommerce         │
│  ├─ 📦 Productos    ← AQUÍ
│  ├─ 📋 Pedidos          │
│  ├─ 📊 Informes         │
│  └─ ⚙️  Ajustes         │
└─────────────────────────┘
```

### 2.2 Click en "Productos"

O también puedes ir directamente a:
```
WooCommerce → Productos → Todos los productos
```

---

## 🔍 Paso 3: Buscar el Producto

### 3.1 Usar el buscador

En la parte superior derecha verás un campo de búsqueda:

```
┌──────────────────────────────────────────────────────────┐
│  Productos (1003)                    🔍 [Buscar productos]│
└──────────────────────────────────────────────────────────┘
```

### 3.2 Buscar por nombre o SKU

Ejemplos:
- Buscar: "BANANA MACHO"
- Buscar: "BM-4MM-SC_GL" (SKU)
- Buscar: "VENTILADOR"

### 3.3 Filtrar por categoría (opcional)

Puedes filtrar por categoría usando el dropdown:

```
Todas las categorías ▼
├─ Electrónica
├─ Electricidad
├─ Ferretería
├─ Conectores
└─ ...
```

---

## ✏️ Paso 4: Editar el Producto

### 4.1 Click en el nombre del producto

En la lista de productos, haz click en el nombre del producto que quieres editar:

```
┌────────────────────────────────────────────────────────────┐
│ ☐  [Imagen]  BANANA MACHO              SKU: BM-4MM-SC_GL  │
│              BM-4MM-SC_GL              $357                │
│              Conectores                Stock: 17           │
│                                                            │
│              Editar | Edición rápida | Papelera | Ver     │
└────────────────────────────────────────────────────────────┘
                ↑
            CLICK AQUÍ
```

### 4.2 O usar "Edición Rápida"

Para cambios rápidos, pasa el mouse sobre el producto y click en "Edición rápida":

```
┌────────────────────────────────────────────────────────────┐
│ ☐  [Imagen]  BANANA MACHO                                 │
│              ────────────────────────────                  │
│              Editar | Edición rápida | Papelera | Ver     │
│                      ↑                                     │
│                  CLICK AQUÍ                                │
└────────────────────────────────────────────────────────────┘
```

---

## 💵 Paso 5: Cambiar el Precio

### 5.1 En la página de edición completa

Busca la sección "Datos del producto" en el lado derecho:

```
┌─────────────────────────────────────────┐
│  Datos del producto                     │
│  ─────────────────────────────────────  │
│                                         │
│  Precio normal (CLP)                    │
│  ┌─────────────────────────────────┐   │
│  │  357                            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Precio de oferta (CLP) [opcional]      │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Importante:** 
- El precio debe incluir IVA
- Usa números sin puntos ni comas (ej: 357, no $357)
- Para $10.000, escribe: 10000

### 5.2 En edición rápida

Se abre un panel desplegable:

```
┌─────────────────────────────────────────────────────────────┐
│  Edición rápida                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  Nombre: [BANANA MACHO                              ]       │
│  SKU:    [BM-4MM-SC_GL                              ]       │
│                                                             │
│  Precio normal: [357    ]  Precio oferta: [        ]       │
│  Stock:         [17     ]  Estado:        [Publicado ▼]    │
│                                                             │
│  [Cancelar]  [Actualizar]                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 Paso 6: Guardar los Cambios

### 6.1 En edición completa

Scroll hacia arriba y click en el botón azul:

```
┌─────────────────────────────────────────┐
│                                         │
│  [  Actualizar  ]  ← CLICK AQUÍ         │
│                                         │
└─────────────────────────────────────────┘
```

### 6.2 En edición rápida

Click en el botón "Actualizar" del panel:

```
[Cancelar]  [Actualizar]  ← CLICK AQUÍ
```

### 6.3 Confirmación

Verás un mensaje verde en la parte superior:

```
┌─────────────────────────────────────────┐
│  ✅ Producto actualizado                │
└─────────────────────────────────────────┘
```

---

## 🔄 Paso 7: Verificar en la Tienda

### 7.1 Abrir tu tienda

```
http://localhost:3001/tienda
```

O en producción:
```
https://grenelectronic.cl/tienda
```

### 7.2 Buscar el producto

Usa el buscador o navega por categorías.

### 7.3 Verificar el precio

El precio actualizado debería aparecer inmediatamente.

**Nota:** Si no ves el cambio, recarga la página (F5 o Ctrl+R).

---

## 🚀 Edición Masiva de Precios

### Para editar varios productos a la vez:

### Opción 1: Edición Masiva en WooCommerce

1. **Selecciona productos:**
   - Marca las casillas de los productos que quieres editar
   
   ```
   ☑ BANANA MACHO
   ☑ FASTON 22-16 AWG
   ☑ CONECTOR RÁPIDO
   ```

2. **Selecciona "Editar" en acciones masivas:**
   
   ```
   Acciones masivas ▼  [Aplicar]
   ├─ Editar
   ├─ Mover a la papelera
   └─ ...
   ```

3. **Cambia los precios:**
   
   Se abre un panel donde puedes cambiar precios de todos a la vez.

4. **Click en "Actualizar"**

### Opción 2: Usar Excel + Script (Para muchos productos)

1. **Exportar a CSV:**
   ```bash
   npm run export:woocommerce
   ```

2. **Abrir en Excel:**
   ```
   data/wc-product-.csv
   ```

3. **Editar precios en la columna "price_net":**
   
   | name | sku | price_net | stock |
   |------|-----|-----------|-------|
   | BANANA MACHO | BM-4MM | 300 → 350 | 17 |
   | FASTON 22-16 | F2216R | 1100 → 1200 | 7 |

4. **Guardar el CSV**

5. **Actualizar WooCommerce:**
   ```bash
   npm run update:prices
   ```

---

## 📊 Ejemplos Prácticos

### Ejemplo 1: Cambiar precio de un producto

**Producto:** BANANA MACHO  
**Precio actual:** $357  
**Precio nuevo:** $400  

**Pasos:**
1. Buscar "BANANA MACHO"
2. Click en "Editar"
3. Cambiar precio de 357 a 400
4. Click "Actualizar"
5. ✅ Listo!

### Ejemplo 2: Aplicar descuento

**Producto:** FUENTE LED 12V 400W  
**Precio normal:** $18,445  
**Precio oferta:** $15,000  

**Pasos:**
1. Buscar "FUENTE LED"
2. Click en "Editar"
3. Precio normal: 18445
4. Precio oferta: 15000
5. Click "Actualizar"
6. ✅ Se muestra con descuento en la tienda!

### Ejemplo 3: Actualizar 10 productos

**Productos:** Todos los FASTON  

**Pasos:**
1. Buscar "FASTON"
2. Seleccionar todos (checkbox)
3. Acciones masivas → Editar
4. Cambiar precio: +10%
5. Click "Actualizar"
6. ✅ Todos actualizados!

---

## 🎨 Interfaz de WooCommerce (Descripción Visual)

### Vista de Lista de Productos

```
┌──────────────────────────────────────────────────────────────────┐
│  WooCommerce > Productos                                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Añadir nuevo  [Categorías] [Etiquetas]    🔍 [Buscar productos]│
│                                                                  │
│  Acciones masivas ▼  [Aplicar]    Todas las categorías ▼        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ ☐  [IMG]  BANANA MACHO                    $357   Stock: 17│ │
│  │           SKU: BM-4MM-SC_GL                                │ │
│  │           Conectores                                       │ │
│  │           Editar | Edición rápida | Papelera | Ver        │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │ ☐  [IMG]  FASTON 22-16 AWG              $1,309  Stock: 7  │ │
│  │           SKU: F2216R_GL                                   │ │
│  │           Aisladores                                       │ │
│  │           Editar | Edición rápida | Papelera | Ver        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ← 1 2 3 ... 11 →                                               │
└──────────────────────────────────────────────────────────────────┘
```

### Vista de Edición de Producto

```
┌──────────────────────────────────────────────────────────────────┐
│  Editar producto                                    [Actualizar] │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Nombre del producto                                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ BANANA MACHO                                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Descripción                                                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ CONECTOR JACK TERMINAL BORNE CONEXION                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Datos del producto                                     │   │
│  │  ─────────────────────────────────────────────────────  │   │
│  │                                                         │   │
│  │  SKU: [BM-4MM-SC_GL                              ]      │   │
│  │                                                         │   │
│  │  Precio normal (CLP)                                    │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  357                                            │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  Precio de oferta (CLP)                                 │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │                                                 │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  Gestionar stock                                        │   │
│  │  ☑ Gestionar existencias                                │   │
│  │                                                         │   │
│  │  Cantidad en stock: [17                           ]     │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  [Actualizar]                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 💡 Consejos y Trucos

### ✅ Mejores Prácticas

1. **Precios con IVA incluido:**
   - Siempre ingresa el precio FINAL que verá el cliente
   - WooCommerce calcula el IVA automáticamente si está configurado

2. **Formato de precios:**
   - ✅ Correcto: 10000 (para $10.000)
   - ✅ Correcto: 357 (para $357)
   - ❌ Incorrecto: $10.000
   - ❌ Incorrecto: 10,000

3. **Precios de oferta:**
   - Usa "Precio de oferta" para descuentos temporales
   - El precio normal se muestra tachado
   - Puedes programar fechas de inicio/fin

4. **Guardar frecuentemente:**
   - Click en "Actualizar" después de cada cambio
   - No confíes en el autoguardado

### 🎯 Atajos de Teclado

- **Buscar:** `Ctrl + K` (en algunos navegadores)
- **Guardar:** `Ctrl + S` (puede funcionar)
- **Cerrar:** `Esc`

### 📱 Desde el Móvil

Descarga la app oficial de WooCommerce:
- **iOS:** App Store → "WooCommerce"
- **Android:** Play Store → "WooCommerce"

Puedes editar precios desde tu teléfono!

---

## 🔢 Calculadora de Precios

### Si tienes el precio NETO y necesitas el precio CON IVA:

```
Precio con IVA = Precio Neto × 1.19
```

**Ejemplos:**

| Precio Neto | × 1.19 | = Precio con IVA |
|-------------|--------|------------------|
| $10.000 | × 1.19 | = $11.900 |
| $5.000 | × 1.19 | = $5.950 |
| $300 | × 1.19 | = $357 |
| $20.000 | × 1.19 | = $23.800 |

### Si tienes el precio CON IVA y necesitas el precio NETO:

```
Precio Neto = Precio con IVA ÷ 1.19
```

**Ejemplos:**

| Precio con IVA | ÷ 1.19 | = Precio Neto |
|----------------|--------|---------------|
| $11.900 | ÷ 1.19 | = $10.000 |
| $5.950 | ÷ 1.19 | = $5.000 |
| $357 | ÷ 1.19 | = $300 |
| $23.800 | ÷ 1.19 | = $20.000 |

---

## ❓ Preguntas Frecuentes

### ¿Cuánto tarda en verse el cambio en la tienda?

**Respuesta:** Inmediatamente. La tienda consulta WooCommerce en cada carga de página.

### ¿Puedo deshacer un cambio?

**Respuesta:** WooCommerce no tiene "deshacer" automático, pero puedes:
1. Ver el historial de revisiones (en la página de edición)
2. Volver a cambiar el precio manualmente
3. Usar los backups de CSV que generamos

### ¿Qué pasa si pongo un precio incorrecto?

**Respuesta:** Puedes editarlo nuevamente en cualquier momento. No hay problema.

### ¿Puedo cambiar precios de muchos productos a la vez?

**Respuesta:** Sí, usa:
1. **Edición masiva** en WooCommerce (hasta 20 productos)
2. **Excel + Script** para cambios masivos (100+ productos)

### ¿El precio incluye IVA?

**Respuesta:** Sí, el precio que ingresas en WooCommerce debe incluir IVA (19%). La tienda lo muestra como "IVA incluido".

### ¿Puedo ver qué productos tienen precio incorrecto?

**Respuesta:** Sí, usa el filtro de precios en WooCommerce:
1. Productos → Todos los productos
2. Filtrar por: Precio → Menor a $100
3. Revisa los resultados

---

## 🛠️ Solución de Problemas

### No puedo acceder a WordPress Admin

**Solución:**
1. Verifica la URL: `https://mediumpurple-dotterel-725437.hostingersite.com/wp-admin`
2. Verifica tu usuario y contraseña
3. Si olvidaste la contraseña, usa "¿Olvidaste tu contraseña?"

### El precio no se actualiza en la tienda

**Solución:**
1. Verifica que guardaste los cambios (click en "Actualizar")
2. Recarga la página de la tienda (F5)
3. Limpia caché del navegador (Ctrl + Shift + R)
4. Verifica que el producto esté "Publicado"

### No encuentro el producto

**Solución:**
1. Usa el buscador con el nombre completo
2. Busca por SKU
3. Filtra por categoría
4. Verifica que no esté en la papelera

### El precio se muestra mal formateado

**Solución:**
1. Verifica que ingresaste solo números (sin $, puntos o comas)
2. Ejemplo correcto: 10000 (no $10.000)

---

## 📋 Checklist de Edición de Precios

Antes de cambiar precios, verifica:

- [ ] Tienes acceso a WordPress Admin
- [ ] Conoces el nombre o SKU del producto
- [ ] Sabes el precio nuevo (con IVA incluido)
- [ ] Tienes un backup (opcional pero recomendado)

Después de cambiar precios:

- [ ] Guardaste los cambios (click en "Actualizar")
- [ ] Verificaste en la tienda que se ve correcto
- [ ] Documentaste el cambio (opcional)

---

## 🎓 Video Tutorial (Recomendado)

Si prefieres ver un video, busca en YouTube:
- "Cómo editar productos en WooCommerce"
- "WooCommerce tutorial español"
- "Cambiar precios WooCommerce"

---

## 📞 Soporte

### Si necesitas ayuda:

1. **Documentación oficial:**
   - [WooCommerce Docs](https://woocommerce.com/documentation/)
   - [Editar productos](https://woocommerce.com/document/managing-products/)

2. **Soporte de hosting:**
   - Hostinger tiene soporte 24/7 en español

3. **Scripts del proyecto:**
   - `npm run export:woocommerce` - Exportar productos
   - `npm run update:prices` - Actualizar desde CSV

---

## ✨ Resumen Rápido

**Para cambiar UN precio:**
1. Ir a: `wp-admin`
2. Productos → Buscar producto
3. Click "Editar"
4. Cambiar precio
5. Click "Actualizar"
6. ✅ Listo!

**Para cambiar MUCHOS precios:**
1. `npm run export:woocommerce`
2. Editar CSV en Excel
3. `npm run update:prices`
4. ✅ Listo!

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0.0

**¡Editar precios es fácil! 🚀**
