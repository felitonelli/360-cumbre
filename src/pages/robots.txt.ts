import type { APIRoute } from 'astro';
import { site, urlSitio } from '../config/site';

// En modo propuesta se bloquea todo; el sitio final abre el paso y anuncia el sitemap.
export const GET: APIRoute = () => {
  const cuerpo = site.modoPropuesta
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${urlSitio}/sitemap-index.xml\n`;
  return new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
