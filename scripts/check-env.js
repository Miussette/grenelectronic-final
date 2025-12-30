#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

const required = [
  'NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT',
  'NEXT_PUBLIC_WC_BASE',
  'WC_KEY',
  'WC_SECRET',
  'APP_BASE_URL'
];

const missing = required.filter(k => !process.env[k]);
if (missing.length > 0) {
  console.error('\nMissing required environment variables for build:');
  missing.forEach(m => console.error(' - ' + m));
  console.error('\nCreate a .env.local file or set these in your CI environment. See docs/wp-setup.md for examples.');
  process.exit(1);
}

console.log('All required env vars present.');
process.exit(0);
