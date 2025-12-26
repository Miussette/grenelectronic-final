// scripts/update-prices-from-csv.ts
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
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

type CSVProduct = {
  name: string;
  sku: string;
  price_net: string;
  stock: string;
  category: string;
  description: string;
  image_path: string;
  active: string;
};

async function updatePricesFromCSV() {
  console.log('🚀 Iniciando actualización de precios desde CSV...\n');

  // Leer archivo CSV
  const csvPath = path.join(process.cwd(), 'data', 'wc-product-.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  // Parsear CSV
  const records: CSVProduct[] = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
    escape: '"',
    quote: '"',
  });

  console.log(`📊 Total de productos en CSV: ${records.length}\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  // Procesar cada producto
  for (const record of records) {
    const sku = record.sku;
    const priceNet = parseFloat(record.price_net);

    // Saltar productos sin precio o con precio 0
    if (!priceNet || priceNet === 0) {
      console.log(`⏭️  Saltando ${record.name} (${sku}) - Sin precio`);
      skipped++;
      continue;
    }

    // Calcular precio con IVA (19%)
    const priceWithIVA = Math.round(priceNet * 1.19);

    try {
      // Buscar producto por SKU
      const response = await api.get('products', { sku });
      const products = response.data;

      if (products.length === 0) {
        console.log(`⚠️  No encontrado: ${record.name} (${sku})`);
        skipped++;
        continue;
      }

      const product = products[0];
      const currentPrice = parseFloat(product.price || '0');

      // Solo actualizar si el precio es diferente
      if (currentPrice !== priceWithIVA) {
        await api.put(`products/${product.id}`, {
          regular_price: priceWithIVA.toString(),
          price: priceWithIVA.toString(),
        });

        console.log(
          `✅ Actualizado: ${record.name} (${sku})\n` +
          `   Precio anterior: $${currentPrice.toLocaleString('es-CL')}\n` +
          `   Precio nuevo: $${priceWithIVA.toLocaleString('es-CL')} (Neto: $${priceNet.toLocaleString('es-CL')} + IVA)`
        );
        updated++;
      } else {
        console.log(`✓ Sin cambios: ${record.name} (${sku}) - $${currentPrice.toLocaleString('es-CL')}`);
        skipped++;
      }

      // Pequeña pausa para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error: any) {
      console.error(`❌ Error actualizando ${record.name} (${sku}):`, error.message);
      errors++;
    }
  }

  // Resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE ACTUALIZACIÓN');
  console.log('='.repeat(60));
  console.log(`✅ Productos actualizados: ${updated}`);
  console.log(`⏭️  Productos saltados: ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
  console.log(`📦 Total procesados: ${records.length}`);
  console.log('='.repeat(60));
}

// Ejecutar
updatePricesFromCSV()
  .then(() => {
    console.log('\n✨ Proceso completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
