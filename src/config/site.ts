// Toda la configuración vive en site.json (se edita a mano o desde el CMS,
// en "Configuración del sitio"). Acá solo se tipa y se arman los links derivados.
import datos from './site.json';

// Claves disponibles y su valor cuando faltan en site.json (el CMS no guarda
// los campos de texto vacíos).
const porDefecto = {
  /** Banda "Propuesta de diseño", noindex y sin sitemap. */
  modoPropuesta: true,
  nombre: '',
  nombreCorto: '',
  eslogan: '',
  /** Con https:// y sin barra final. Vacío: en Vercel y Cloudflare Pages se detecta sola. */
  urlSitio: '',
  /** Solo números, con código de país: 5493435551234. */
  whatsapp: '',
  /** Usuario, sin la arroba. */
  instagram: '',
  facebook: { nombre: '', url: '' },
  direccion: { calle: '', localidad: '', departamento: '', provincia: '', codigoPostal: '' },
  coordenadas: { lat: 0, lng: 0 },
  mapa: { consulta: '', zoom: 14 },
  resenasGoogle: { puntaje: '', cantidad: '', url: '' },
  mercadoPago: { activo: false, link: '' },
  analitica: { activa: false, ga4Id: '', plausibleDominio: '' },
  credito: { nombre: '', url: '' },
};

export type Site = typeof porDefecto;

function completar<T extends Record<string, unknown>>(base: T, valores: Record<string, unknown>): T {
  const resultado: Record<string, unknown> = { ...base };
  for (const [clave, valor] of Object.entries(valores)) {
    const previo = resultado[clave];
    resultado[clave] =
      previo && typeof previo === 'object' && valor && typeof valor === 'object'
        ? completar(previo as Record<string, unknown>, valor as Record<string, unknown>)
        : (valor ?? previo);
  }
  return resultado as T;
}

export const site: Site = completar(porDefecto, datos);

/** Dirección pública sin barra final: la de site.json o la que detecta astro.config.mjs. */
export const urlSitio = (import.meta.env.SITE ?? '').replace(/\/$/, '');

/** Marca visible para los datos que todavía hay que pedirle al dueño. */
export const PENDIENTE = '[a confirmar]';

const { direccion, coordenadas, mapa } = site;

const unir = (...partes: string[]) => partes.filter(Boolean).join(', ');

export const direccionCorta = unir(direccion.localidad, direccion.departamento, direccion.provincia);
export const direccionCompleta = unir(direccion.calle, direccionCorta);

export const mensajeWhatsApp = `Hola! Vi la web de ${site.nombre} y quería hacer una consulta.`;

export function linkWhatsApp(mensaje: string = mensajeWhatsApp): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Teléfono en formato internacional para schema.org. */
export const telefono = `+${site.whatsapp}`;

export const linkInstagram = site.instagram ? `https://www.instagram.com/${site.instagram}/` : '';

// Si hay una consulta de texto, Google muestra el pin del negocio con su nombre;
// si no, cae a las coordenadas.
const destinoMapa = mapa.consulta || `${coordenadas.lat},${coordenadas.lng}`;

export const linkMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinoMapa)}`;
export const embedMaps = `https://www.google.com/maps?q=${encodeURIComponent(destinoMapa)}&z=${mapa.zoom}&hl=es&output=embed`;
export const linkResenas = site.resenasGoogle.url || linkMaps;

export const mostrarSena = Boolean(site.mercadoPago.activo && site.mercadoPago.link);
