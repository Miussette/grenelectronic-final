# 💰 Actualizar Precios desde CSV

## Problema

Algunos productos en la tienda aparecen con precios incorrectos (ej: $1) cuando en realidad tienen precios diferentes en la planilla CSV.

## Solución

Se creó un script que actualiza automáticamente los precios en WooCommerce basándose en la planilla CSV `data/wc-product-.csv`.

## Cómo Usar

### 1. Instalar dependencias (si es necesario)

```bash
npm install
```

### 2. Verificar credenciales

Asegúrate de que tu archivo `.env.local` tenga las credenciales correctas:

```bash
WC_URL=https://mediumpurple-dotterel-725437.hostingersite.com
WC_KEY=ck_9233834ce4dc58e9e74adde8ff45870c51781f69
WC_SECRET=cs_f4e77a9b4d196807b41749f7bbdf5b9066648ee0
```

### 3. Ejecutar el script

```bash
npm run update:prices
```

## Qué Hace el Script

1. **Lee la planilla CSV** (`data/wc-product-.csv`)
2. **Para cada producto:**
   - Busca el producto en WooCommerce por SKU
   - Calcula el precio con IVA (precio neto × 1.19)
   - Compara con el precio actual
   - Si es diferente, actualiza el precio
3. **Muestra un resumen** al final

## Ejemplo de Salida

```
🚀 Iniciando actualización de precios desde CSV...

📊 Total de productos en CSV: 500

✅ Actualizado: TRANSISTOR BC 337 (I2-39)
   Precio anterior: $1
   Precio nuevo: $238 (Neto: $200 + IVA)

✅ Actualizado: ALCOHOL ISOPROPILICO 5 LITROS (ALI-5 / Q3)
   Precio anterior: $1
   Precio nuevo: $23.800 (Neto: $20.000 + IVA)

✓ Sin cambios: ADAPTADOR EURO AMERICANO (EA2p / P3-1) - $476

⏭️  Saltando MG4896-ETH CONTROL DE AFORO PARA PARKING (AP4896-ETH) - Sin precio

============================================================
📊 RESUMEN DE ACTUALIZACIÓN
============================================================
✅ Productos actualizados: 245
⏭️  Productos saltados: 250
❌ Errores: 5
📦 Total procesados: 500
============================================================

✨ Proceso completado exitosamente
```

## Cálculo de Precios

El script toma el precio neto del CSV y le agrega el IVA (19%):

```
Precio Final = Precio Neto × 1.19
```

**Ejemplo:**
- Precio neto en CSV: $20.000
- IVA (19%): $3.800
- Precio final: $23.800

## Productos que se Saltan

El script NO actualiza productos que:
- No tienen precio en el CSV (precio = 0)
- No se encuentran en WooCommerce
- Ya tienen el precio correcto

## Productos de Desarrollo

Los productos en la categoría "desarrollo" (proyectos personalizados) generalmente tienen precio 0 en el CSV porque se cotizan individualmente. Estos se saltan automáticamente.

## Seguridad

- ✅ El script hace una pausa de 500ms entre cada actualización para no saturar la API
- ✅ Solo actualiza si el precio es diferente
- ✅ Muestra qué va a cambiar antes de hacerlo
- ✅ Maneja errores sin detener el proceso completo

## Troubleshooting

### Error: "Faltan credenciales de WooCommerce"

**Solución:** Verifica que `.env.local` tenga las variables `WC_URL`, `WC_KEY` y `WC_SECRET`.

### Error: "No encontrado: [Producto]"

**Causa:** El producto existe en el CSV pero no en WooCommerce.

**Solución:** 
1. Verifica que el SKU sea correcto
2. Importa el producto primero con `npm run import:electronica`

### Error: "HTTP 401 Unauthorized"

**Causa:** Credenciales incorrectas.

**Solución:** Verifica que `WC_KEY` y `WC_SECRET` sean correctos.

### Error: "HTTP 429 Too Many Requests"

**Causa:** Demasiadas peticiones a la API.

**Solución:** El script ya tiene pausas de 500ms. Si persiste, aumenta el tiempo en el código:

```typescript
await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo
```

## Verificar Resultados

Después de ejecutar el script:

1. **En la tienda:**
   ```
   http://localhost:3000/tienda
   ```
   Verifica que los precios se muestren correctamente

2. **En WooCommerce Admin:**
   ```
   https://mediumpurple-dotterel-725437.hostingersite.com/wp-admin/edit.php?post_type=product
   ```
   Revisa los productos actualizados

## Archivos Relacionados

- **Script:** `scripts/update-prices-from-csv.ts`
- **CSV:** `data/wc-product-.csv`
- **Package.json:** Comando `update:prices`

## Notas Importantes

1. **Backup:** Siempre haz un backup de WooCommerce antes de actualizar precios masivamente
2. **Prueba primero:** Prueba con algunos productos antes de actualizar todos
3. **Horario:** Ejecuta el script en horarios de bajo tráfico
4. **Logs:** Guarda la salida del script para referencia

## Actualizar Solo Algunos Productos

Si quieres actualizar solo algunos productos, puedes modificar el CSV temporalmente o editar el script para filtrar por categoría:

```typescript
// En el script, después de parsear el CSV:
const filteredRecords = records.filter(r => r.category === 'electrónica');
```

---

**Creado:** Noviembre 2025  
**Versión:** 1.0.0
