// Lista lo que falta antes de publicar el sitio final:
//   npm run pendientes
// Busca los "[a confirmar]" en el contenido y revisa la configuración.
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const raiz = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const WHATSAPP_DE_PRUEBA = '5493430000000';

function archivos(carpeta) {
  return readdirSync(carpeta, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(carpeta, entrada.name);
    return entrada.isDirectory() ? archivos(ruta) : [ruta];
  });
}

let total = 0;
for (const ruta of [...archivos(join(raiz, 'src/content')), join(raiz, 'src/config/site.json')]) {
  const lineas = readFileSync(ruta, 'utf8').split('\n');
  const marcas = lineas.flatMap((linea, i) => (/\[a confirmar/i.test(linea) ? [`  línea ${i + 1}: ${linea.trim()}`] : []));
  if (marcas.length) {
    console.log(`\n${relative(raiz, ruta)}`);
    console.log(marcas.join('\n'));
    total += marcas.length;
  }
}

const site = JSON.parse(readFileSync(join(raiz, 'src/config/site.json'), 'utf8'));
const avisos = [
  site.modoPropuesta && 'modoPropuesta sigue activo (banda de propuesta, noindex, sin sitemap).',
  site.whatsapp === WHATSAPP_DE_PRUEBA && 'El WhatsApp es el número de prueba, no el del complejo.',
  !site.facebook?.url && 'Falta el link de Facebook.',
  !site.credito?.url && 'Falta el link del crédito del pie.',
  !site.urlSitio && 'urlSitio está vacío: en Vercel y Cloudflare Pages se detecta sola; con dominio propio hay que completarlo.',
  /\.(vercel\.app|pages\.dev)$/.test(site.urlSitio ?? '') && 'urlSitio es la dirección gratuita del hosting (cambiar si hay dominio propio).',
].filter(Boolean);

console.log(`\nConfiguración (src/config/site.json)`);
console.log(avisos.length ? avisos.map((a) => `  ${a}`).join('\n') : '  Sin observaciones.');
console.log(`\n${total} líneas con datos a confirmar.`);
