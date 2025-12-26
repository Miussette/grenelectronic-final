// scripts/export-from-woocommerce.ts
import fs from 'fs';
import path from 'path';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const WC_URL = process.env.WC_URL;
const WC_KEY = process.env.WC_KEY;
const WC_SECRET = process.env.WC_SECRET;

if (!WC_URL || !WC_KEY || !WC_SECRET) {
  console.error('❌ Faltan credenciales de WooCommerce en .env.local');
  process.exit(1);
}

// Inicializar cliente de WooCommerce
const api = new WooCommerceRestApi({
  url: WC_URL,
  consumerKey: WC_KEY,
  consumerSecret: WC_SECRET,
  version: 'wc/v3',
});

async function exportFromWooCommerce() {
  console.log('🚀 Exportando productos desde WooCommerce...\n');

  try {
    let allProducts: any[] = [];
    let page = 1;
    let hasMore = true;

    // Obtener todos los productos (paginado)
    while (hasMore) {
      console.log(`📦 Obteniendo página ${page}...`);
      
      const response = await api.get('products', {
        per_page: 100,
        page,
      });

      const products = response.data;
      allProducts = allProducts.concat(products);

      // Verificar si hay más páginas
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1');
      hasMore = page < totalPages;
      page++;

      // Pequeña pausa para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`\n✅ Total de productos obtenidos: ${allProducts.length}\n`);

    // Convertir a formato CSV
    const csvLines: string[] = [];
    
    // Encabezado
    csvLines.push('name,sku,price_net,stock,category,description,image_path,active');

    // Procesar cada producto
    for (const product of allProducts) {
      const price = parseFloat(product.price || '0');
      const priceNet = price > 0 ? Math.round(price / 1.19) : 0; // Quitar IVA
      
      // Obtener primera categoría
      const category = product.categories && product.categories.length > 0
        ? product.categories[0].slug
        : '';

      // Obtener imagen
      const imagePath = product.images && product.images.length > 0
        ? `products/${product.sku}.jpg`
        : '';

      // No incluir descripción para evitar problemas de formato
      const description = '';

      // Estado
      const active = product.status === 'publish' ? 'True' : 'False';

      // Stock
      const stock = product.stock_quantity || 0;

      // Crear línea CSV
      const line = [
        product.name,
        product.sku || '',
        priceNet.toString(),
        stock.toString(),
        category,
        description,
        imagePath,
        active,
      ].map(field => {
        // Escapar campos que contienen comas o comillas
        if (field.includes(',') || field.includes('"') || field.includes('\n')) {
          return `"${field}"`;
        }
        return field;
      }).join(',');

      csvLines.push(line);
    }

    // Guardar CSV
    const csvContent = csvLines.join('\n');
    const csvPath = path.join(process.cwd(), 'data', 'wc-product-.csv');
    
    // Crear backup del archivo anterior
    if (fs.existsSync(csvPath)) {
      const backupPath = path.join(
        process.cwd(), 
        'data', 
        `wc-product-backup-${Date.now()}.csv`
      );
      fs.copyFileSync(csvPath, backupPath);
      console.log(`💾 Backup creado: ${path.basename(backupPath)}`);
    }

    // Guardar nuevo CSV
    fs.writeFileSync(csvPath, csvContent, 'utf-8');
    console.log(`✅ CSV exportado: ${csvPath}`);
    console.log(`📊 Total de productos: ${allProducts.length}`);

    // Estadísticas
    const withPrice = allProducts.filter(p => parseFloat(p.price || '0') > 0).length;
    const withoutPrice = allProducts.length - withPrice;
    const published = allProducts.filter(p => p.status === 'publish').length;

    console.log('\n' + '='.repeat(60));
    console.log('📊 ESTADÍSTICAS');
    console.log('='.repeat(60));
    console.log(`📦 Total de productos: ${allProducts.length}`);
    console.log(`💰 Con precio: ${withPrice}`);
    console.log(`🆓 Sin precio: ${withoutPrice}`);
    console.log(`✅ Publicados: ${published}`);
    console.log(`❌ No publicados: ${allProducts.length - published}`);
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Detalles:', error.response.data);
    }
    process.exit(1);
  }
}

// Ejecutar
exportFromWooCommerce()
  .then(() => {
    console.log('\n✨ Exportación completada exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
