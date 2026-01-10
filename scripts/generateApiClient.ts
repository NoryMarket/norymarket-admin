#!/usr/bin/env ts-node

import 'dotenv/config';
import { execSync } from 'child_process';
import path from 'path';

// Tomamos la URL del sistema o del .env
const apiUrl = process.env.VITE_API_URL;
if (!apiUrl) {
  console.error('❌ VITE_API_URL env not found');
  process.exit(1);
}

// Carpeta de salida del cliente
const outputDir = process.env.API_CLIENT_OUTPUT || 'src/api';
const fileName = process.env.API_CLIENT_FILENAME || 'api.ts';

// Construimos el comando de swagger-typescript-api
const cmd = [
  'swagger-typescript-api',
  'generate',
  `-p ${apiUrl}/doc-json`,
  `-o ${outputDir}`,
  `-n ${fileName}`,
].join(' ');

console.log('🚀 Generating Api client from Swagger JSON...');
console.log(cmd);

try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('✅ Api client successfully generated', path.resolve(outputDir, fileName));
} catch (err) {
  console.error('❌ Error while generating Api client:', err);
  process.exit(1);
}
