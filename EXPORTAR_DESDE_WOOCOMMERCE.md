# 📥 Exportar Productos desde WooCommerce

## Propósito

Este script descarga todos los productos actuales de WooCommerce y genera un archivo CSV actualizado. Útil para:

- Tener un backup de los productos
- Sincronizar el CSV local con WooCommerce
- Usar WooCommerce como "fuente de verdad"

## Cómo Usar

```bash
npm run export:woocommerce
```

## Qué Hace

1. **Conecta a WooCommerce** usando las credenciales de `.env.local`
2. **Descarga todos los productos** (maneja paginación automáticamente)
3. **Crea un backup** del CSV anterior (si existe)
4. **Genera un nuevo CSV** con el formato correcto
5. **Muestra estadísticas** de los productos exportados

## Formato del CSV

El CSV generado tiene las siguientes columnas:

```csv
name,sku,price_net,stock,category,description,image_path,active
```

### Detalles de las columnas:

- **name**: Nombre del producto
- **sku**: Código único del producto
- **price_net**: Precio sin IVA (se calcula automáticamente: precio / 1.19)
- **stock**: Cantidad en stock
- **category**: Primera categoría del producto (slug)
- **description**: Descripción corta del producto
- **image_path**: Ruta de la imagen (formato: `products/SKU.jpg`)
- **active**: `True` si está publicado, `False` si no

## Ejemplo de Salida

```
🚀 Exportando productos desde WooCommerce...

📦 Obteniendo página 1...
📦 Obteniendo página 2...
📦 Obteniendo página 3...

✅ Total de productos obtenidos: 245

💾 Backup creado: wc-product-backup-1732123456789.csv
✅ CSV exportado: /path/to/data/wc-product-.csv
📊 Total de productos: 245

============================================================
📊 ESTADÍSTICAS
============================================================
📦 Total de productos: 245
💰 Con precio: 195
🆓 Sin precio: 50
✅ Publicados: 230
❌ No publicados: 15
============================================================

✨ Exportación completada exitosamente
```

## Backup Automático

Antes de sobrescribir el CSV existente, el script crea un backup con timestamp:

```
data/wc-product-backup-1732123456789.csv
```

Esto te permite recuperar versiones anteriores si es necesario.

## Cálculo de Precios

El script convierte los precios de WooCommerce (con IVA) a precios netos:

```
Precio Neto = Precio WooCommerce / 1.19
```

**Ejemplo:**
- Precio en WooCommerce: $23.800
- Precio neto en CSV: $20.000

## Flujo de Trabajo Recomendado

### Opción 1: WooCommerce como fuente de verdad

```bash
# 1. Exportar desde WooCommerce
npm run export:woocommerce

# 2. Editar el CSV si es necesario
# (Abrir data/wc-product-.csv en Excel/LibreOffice)

# 3. Actualizar WooCommerce desde el CSV
npm run update:prices
```

### Opción 2: CSV como fuente de verdad

```bash
# 1. Editar el CSV directamente
# (data/wc-product-.csv)

# 2. Actualizar WooCommerce
npm run update:prices

# 3. Exportar para confirmar
npm run export:woocommerce
```

## Casos de Uso

### 1. Backup Regular

Ejecuta el script periódicamente para tener backups:

```bash
# Crear un backup semanal
npm run export:woocommerce
```

### 2. Sincronizar después de cambios manuales

Si editaste productos en WooCommerce Admin:

```bash
# Descargar los cambios
npm run export:woocommerce
```

### 3. Migración de datos

Para mover productos entre ambientes:

```bash
# En producción
npm run export:woocommerce

# Copiar el CSV a desarrollo
# En desarrollo
npm run update:prices
```

## Limitaciones

- **Imágenes**: Solo guarda la ruta, no descarga las imágenes
- **Variaciones**: No exporta variaciones de productos
- **Atributos**: Solo exporta datos básicos
- **Categorías**: Solo la primera categoría

## Troubleshooting

### Error: "HTTP 401 Unauthorized"

**Causa:** Credenciales incorrectas.

**Solución:** Verifica `WC_KEY` y `WC_SECRET` en `.env.local`.

### Error: "HTTP 429 Too Many Requests"

**Causa:** Demasiadas peticiones.

**Solución:** El script ya tiene pausas de 500ms. Si persiste, aumenta el tiempo:

```typescript
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo
```

### CSV con caracteres extraños

**Causa:** Problemas de encoding.

**Solución:** Abre el CSV con un editor que soporte UTF-8 (VS Code, Notepad++).

### Productos faltantes

**Causa:** Productos en borrador o privados.

**Solución:** El script solo exporta productos publicados. Para incluir todos:

```typescript
// En el script, cambiar:
const response = await api.get('products', {
  per_page: 100,
  page,
  status: 'any', // Agregar esta línea
});
```

## Archivos Relacionados

- **Script:** `scripts/export-from-woocommerce.ts`
- **CSV generado:** `data/wc-product-.csv`
- **Backups:** `data/wc-product-backup-*.csv`
- **Package.json:** Comando `export:woocommerce`

## Seguridad

- ✅ No expone credenciales (usa `.env.local`)
- ✅ Crea backups automáticos
- ✅ Pausa entre peticiones (no satura la API)
- ✅ Maneja errores sin perder datos

## Notas

- El script puede tardar varios minutos si tienes muchos productos
- Los backups se acumulan, puedes eliminar los antiguos manualmente
- El CSV usa formato estándar (compatible con Excel, Google Sheets, etc.)

---

**Creado:** Noviembre 2025  
**Versión:** 1.0.0
