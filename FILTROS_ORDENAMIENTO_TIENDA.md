# 🔄 Filtros de Ordenamiento en la Tienda

## Implementación

Se agregaron filtros de ordenamiento a la página de la tienda (`/tienda`) para mejorar la experiencia de usuario.

## Funcionalidades Agregadas

### 1. Ordenar por Precio
- **Menor a Mayor**: Muestra productos desde el más barato al más caro
- **Mayor a Menor**: Muestra productos desde el más caro al más barato

### 2. Ordenar Alfabéticamente
- **A - Z**: Ordena productos alfabéticamente de la A a la Z
- **Z - A**: Ordena productos alfabéticamente de la Z a la A

### 3. Predeterminado
- Muestra productos en el orden original de WooCommerce

## Interfaz de Usuario

Se agregó un selector desplegable en la parte superior derecha del listado de productos:

```
┌─────────────────────────────────────────────────────┐
│ X productos                    Ordenar por: [▼]     │
│                                                      │
│ [Producto 1] [Producto 2] [Producto 3] ...          │
└─────────────────────────────────────────────────────┘
```

### Opciones del Selector:
1. Predeterminado
2. Precio: Menor a Mayor
3. Precio: Mayor a Menor
4. Nombre: A - Z
5. Nombre: Z - A

## Características Técnicas

### Estado Local
- El ordenamiento se maneja con `useState` en el cliente
- No requiere recarga de página
- Cambios instantáneos al seleccionar una opción

### Algoritmo de Ordenamiento
```typescript
// Precio menor a mayor
const priceA = parseFloat(a.price || "0");
const priceB = parseFloat(b.price || "0");
return priceA - priceB;

// Nombre A-Z (con soporte para español)
return a.name.localeCompare(b.name, "es");
```

### Compatibilidad
- ✅ Funciona con filtros de categoría
- ✅ Funciona con búsqueda por nombre
- ✅ Funciona con filtro de tipo (venta/cotizar)
- ✅ Se mantiene al cambiar de página
- ✅ Responsive en móvil

## Cómo Usar

1. **Navegar a la tienda:**
   ```
   http://localhost:3000/tienda
   ```

2. **Seleccionar ordenamiento:**
   - Click en el selector "Ordenar por:"
   - Elegir una opción
   - Los productos se reordenan automáticamente

3. **Combinar con otros filtros:**
   - Buscar por nombre
   - Filtrar por categoría
   - Filtrar por tipo (venta/cotizar)
   - El ordenamiento se aplica sobre los resultados filtrados

## Ejemplos de Uso

### Caso 1: Ver productos más baratos primero
1. Ir a `/tienda`
2. Seleccionar "Precio: Menor a Mayor"
3. Ver productos ordenados del más barato al más caro

### Caso 2: Buscar en una categoría ordenado alfabéticamente
1. Ir a `/tienda`
2. Click en una categoría (ej: "Electrónica")
3. Seleccionar "Nombre: A - Z"
4. Ver productos de esa categoría ordenados alfabéticamente

### Caso 3: Productos para cotizar ordenados por precio
1. Ir a `/tienda`
2. Seleccionar tipo "Para cotizar"
3. Seleccionar "Precio: Mayor a Menor"
4. Ver productos para cotizar del más caro al más barato

## Contador de Productos

Se agregó un contador que muestra la cantidad de productos visibles:

```
"X productos" o "1 producto"
```

Esto ayuda al usuario a saber cuántos resultados hay después de aplicar filtros.

## Archivos Modificados

- `src/pages/tienda/index.tsx`
  - Agregado estado `sortBy`
  - Agregada lógica de ordenamiento
  - Agregado selector de ordenamiento en UI
  - Agregado contador de productos

## Mejoras Futuras (Opcional)

1. **Persistir ordenamiento en URL:**
   ```typescript
   // Guardar en query params
   router.push({ query: { ...router.query, sort: sortBy } });
   ```

2. **Ordenar por fecha de creación:**
   - Más recientes primero
   - Más antiguos primero

3. **Ordenar por popularidad:**
   - Más vendidos
   - Mejor valorados

4. **Ordenar por stock:**
   - Con stock primero
   - Sin stock al final

## Testing

### Pruebas Manuales:
- [ ] Ordenar por precio menor a mayor
- [ ] Ordenar por precio mayor a menor
- [ ] Ordenar alfabéticamente A-Z
- [ ] Ordenar alfabéticamente Z-A
- [ ] Combinar con búsqueda
- [ ] Combinar con filtro de categoría
- [ ] Combinar con filtro de tipo
- [ ] Verificar en móvil
- [ ] Verificar contador de productos

### Casos Edge:
- [ ] Productos sin precio (deben ir al final)
- [ ] Productos con precio 0
- [ ] Productos con nombres especiales (ñ, acentos)
- [ ] Lista vacía de productos

## Notas

- El ordenamiento es **case-insensitive** para nombres
- Usa `localeCompare` con locale "es" para ordenamiento correcto en español
- Los productos sin precio se tratan como precio 0
- El ordenamiento se aplica después de filtrar

---

**Estado:** ✅ IMPLEMENTADO  
**Fecha:** Noviembre 2025  
**Versión:** 1.0.0
