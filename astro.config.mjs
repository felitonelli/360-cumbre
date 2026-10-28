// @ts-check
import { readFileSync, writeFileSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import { fuentes } from './src/config/tema.mjs';

const site = JSON.parse(readFileSync(new URL('./src/config/site.json', import.meta.url), 'utf8'));

// El panel de Keystatic necesita rutas con servidor. Se carga solo en
// `astro dev`, así el build queda 100 % estático y sin adaptador.
const esDev = process.argv.includes('dev');

/** Dirección pública según el hosting donde corre el build, si se puede saber. */
function urlDelHosting() {
  const { VERCEL_ENV, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL, CF_PAGES_URL, CF_PAGES_BRANCH } = process.env;
  // Vercel: el dominio de producción o, en una vista previa, el del deploy.
  if (VERCEL_URL) return `https://${VERCEL_ENV === 'production' ? VERCEL_PROJECT_PRODUCTION_URL : VERCEL_URL}`;
  // Cloudflare Pages da la dirección de cada deploy (hash.proyecto.pages.dev);
  // en la rama principal, la estable es la del proyecto, sin el hash.
  if (CF_PAGES_URL) {
    const url = new URL(CF_PAGES_URL);
    if (CF_PAGES_BRANCH === 'main') url.hostname = url.hostname.split('.').slice(1).join('.');
    return url.origin;
  }
}

// Si urlSitio está vacío en site.json, se usa la que informa el hosting.
const urlSitio = site.urlSitio || urlDelHosting();

/** @param {'titulos' | 'textos'} rol */
function fuente(rol) {
  const { nombre, pesos, respaldo } = fuentes[rol];
  // La itálica es opcional: se pide con `estilos` en tema.mjs.
  const estilos = 'estilos' in fuentes[rol] ? fuentes[rol].estilos : ['normal'];
  return {
    provider: fontProviders.fontsource(),
    name: nombre,
    cssVariable: `--fuente-${rol}`,
    weights: /** @type {[string | number, ...(string | number)[]]} */ (pesos),
    styles: /** @type {['normal' | 'italic', ...('normal' | 'italic')[]]} */ (estilos),
    subsets: /** @type {[string]} */ (['latin']),
    fallbacks: respaldo,
  };
}

/** En Cloudflare Pages escribe dist/_headers (en Vercel las cabeceras van en vercel.json). */
function cabecerasCloudflare() {
  return {
    name: 'cabeceras-cloudflare',
    hooks: {
      /** @param {{ dir: URL }} opciones */
      'astro:build:done': ({ dir }) => {
        if (!process.env.CF_PAGES) return;
        const reglas = ['/_astro/*', '  Cache-Control: public, max-age=31536000, immutable', ''];
        if (site.modoPropuesta) reglas.push('/*', '  X-Robots-Tag: noindex, nofollow', '');
        writeFileSync(new URL('_headers', dir), reglas.join('\n'));
      },
    },
  };
}

export default defineConfig({
  site: urlSitio,
  server: { port: 4321 },
  build: { inlineStylesheets: 'always' },
  integrations: [
    // Con modoPropuesta activo no se publica sitemap.
    ...(site.modoPropuesta ? [] : [sitemap()]),
    ...(esDev ? [react(), keystatic()] : []),
    cabecerasCloudflare(),
  ],
  vite: { plugins: [tailwindcss()] },
  fonts: [fuente('titulos'), fuente('textos')],
});
