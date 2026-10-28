## Proyecto

Sitio estático de un complejo de cabañas (Astro + Tailwind + Keystatic). Es la propuesta de diseño para Cabañas 360 Cumbre (El Durazno, Córdoba) y, a la vez, la variante "montaña / premium" de la plantilla de turismo: cómo reutilizarla está en `VARIANTE-MONTANA.md`. Todo el código, los comentarios y los textos están en español rioplatense.

- Lo propio de cada complejo vive en `src/config/`, `src/content/`, `src/assets/fotos/` y los íconos de `public/`. Componentes, estilos base y esquemas son plantilla: un cambio ahí tiene que servir para cualquier complejo.
- La configuración vive en `src/config/site.json`; el contenido, en `src/content/` (YAML que escribe Keystatic).
- La página tiene modo día y noche. Los colores están en `src/config/tema.css` y los componentes los usan por función (`fondo`, `superficie`, `tinta`, `tinta-suave`, `linea`, `acento`, `etiqueta`, `boton`, `sobre-boton`), que cambian solas con el modo. Nada de valores hex en los componentes. Las secciones `.respiro` toman los colores del otro modo y `.siempre-noche` queda oscura en los dos.
- El modo inicial se decide en el `<head>` de `Base.astro`; `scripts/modo.ts` lo cambia y avisa con el evento `cambio-de-modo`.
- `keystatic.config.ts` y `src/content.config.ts` son espejo uno del otro: un campo nuevo va en los dos.
- Keystatic y React se cargan solo en `astro dev`. El build tiene que seguir siendo 100 % estático, sin adaptador.
- No inventar datos del negocio. Lo que falte se escribe `[a confirmar]` y se anota en `PENDIENTES.md`.
- Mientras `modoPropuesta` sea `true`, no usar el logo del complejo ni su número de WhatsApp. Las fotos de su Instagram se usan porque Felipe las pasó para la propuesta; para el sitio final hace falta el permiso de los dueños (ver `CREDITOS.md`).
- Animaciones solo con `opacity` y `transform`, y todas apagadas con `prefers-reduced-motion`. Nada de librerías de animación.
- Se publica desde `main` (Vercel o Cloudflare Pages): no hacer push sin que lo pidan.
- Antes de dar algo por terminado: `npm run check` y `npm run build`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
