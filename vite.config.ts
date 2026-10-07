import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'node:fs';
// Host adicional para la vista previa privada. Va en un archivo local, fuera del repositorio.
const allowedHosts = existsSync('.preview-host') ? [readFileSync('.preview-host', 'utf8').trim()] : [];
export default defineConfig({plugins:[react()],server:{allowedHosts},preview:{allowedHosts}});
