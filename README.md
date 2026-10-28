# Cabañas 360 Cumbre: propuesta de sitio

Sitio de una página para casas de montaña para parejas en El Durazno (Calamuchita, Córdoba). Está pensado como link de la bio de Instagram: el que entra ve las sierras, recorre las casas y consulta por WhatsApp con las fechas ya cargadas.

Hoy está en **modo propuesta**. Es un trabajo de muestra para presentarles a los dueños, no el sitio oficial: tiene la banda de aviso, `noindex`, fotos de banco y un WhatsApp de prueba.

- **Astro 7** + **Tailwind CSS 4**, 100 % estático, sin backend.
- **Keystatic** como panel de contenido (corre solo en tu compu).
- Se publica en **Cloudflare Pages**.
- Usa la lógica de la plantilla `alisos-del-rio-propuesta` (configuración, panel, formulario a WhatsApp, modo propuesta, SEO, analítica). El diseño es nuevo: la variante **montaña / premium**, que se explica en [VARIANTE-MONTANA.md](VARIANTE-MONTANA.md).

Para leer antes de la reunión: [PENDIENTES.md](PENDIENTES.md) (preguntas para los dueños), [CREDITOS.md](CREDITOS.md) (las fotos) y [GUION-VIDEO.md](GUION-VIDEO.md) (el video para Instagram).

## El diseño: "Brasa"

Dos momentos del lugar: el día con las sierras de fondo y la noche con el fuego encendido.

- **Portada panorámica.** La foto es más ancha que la pantalla y se recorre sola, despacio. También se mueve con el dedo, el mouse, el trackpad o las flechas. Un aro ámbar marca la posición. En el celular, nombre, frase y botón entran sin scrollear.
- **Interruptor día / noche.** Cambia la paleta y la foto de la portada. Arranca según el sistema del visitante (modo claro → día; oscuro o sin preferencia → noche) y recuerda la elección en el navegador.
- **Las casas como fichas.** Foto grande en forma de arco, "para 2 personas", nombre en serif y hasta cuatro detalles. En el celular se pasan de costado; en pantallas anchas quedan una debajo de la otra. Cada una abre su galería a pantalla completa y tiene "Consultar por esta casa", que abre el formulario con la casa ya elegida.
- **Un fin de semana en 360 Cumbre.** Línea de tiempo vertical, de la llegada al desayuno del domingo.
- **Cortes con silueta de sierra** entre secciones, en lugar de líneas rectas. No copian el logo.
- **Formulario en una hoja.** En el celular, una barra fija "Elegí tus fechas" abre el formulario desde abajo; en pantallas anchas aparece al medio.
- **Textura.** Grano de película muy suave, luz de fogón detrás de los títulos y aparición suave de los elementos. Con "reducir movimiento" no se mueve nada solo.

Paleta: carbón `#1E1B18`, crema `#F3EDE2`, cobre `#A65A27` (botones), ámbar `#E8A33D` (detalles), salvia y piedra. Tipografías: Cormorant Garamond 600 con itálica para títulos y Manrope para textos, autoalojadas y con `font-display: swap`. Es otra combinación que la de Alisos (Fraunces + Figtree) y la de Los Naranjos (Bricolage Grotesque + DM Sans).

## Cómo correrlo

Necesitás Node 22.12 o superior.

```bash
npm install
```

```bash
npm run dev
```

- Sitio: <http://127.0.0.1:4321>
- Panel de contenido: <http://127.0.0.1:4321/keystatic>

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo, con el panel de contenido |
| `npm run build` | Genera el sitio final en `dist/` |
| `npm run preview` | Sirve `dist/` para probar el build |
| `npm run check` | Chequeo de tipos |
| `npm run pendientes` | Lista los `[a confirmar]` que quedan y revisa la configuración |

> **Windows:** cloná el repo en una ruta corta (por ejemplo `C:\Users\vos\source\repos\`). Con rutas de más de 260 caracteres el build falla.

## Estructura

```
keystatic.config.ts        Panel de contenido
astro.config.mjs           Fuentes, Keystatic solo en dev, cabeceras de Cloudflare
src/
  config/
    site.json              Configuración central (nombre, WhatsApp, mapa, modo propuesta…)
    site.ts                La tipa y arma los links de WhatsApp y Maps
    tema.css               Paleta y valores de cada función en modo día y noche
    tema.mjs               Tipografías, color del navegador y modo por defecto
    iconos.ts              Íconos elegibles desde el panel
  content/                 YAML que escribe el panel
    sitio/complejo.yaml    Portada, títulos, spa, la zona, fin de semana, formulario, condiciones
    cabanas/ testimonios/ faq/
  content.config.ts        Esquemas (espejo de keystatic.config.ts)
  assets/fotos/            Fotos originales; Astro las pasa a AVIF/WebP
  components/              Cabecera, interruptor, hoja de consulta, barra, pie, sierra…
  components/secciones/    Una por sección
  layouts/Base.astro       <head>, modo inicial sin parpadeo, SEO, banda de propuesta
  scripts/                 modo.ts, panorama.ts, consulta.ts, dialogo.ts, aparecer.ts, analitica.ts
  pages/                   index, privacidad, 404, robots.txt
scripts/pendientes.mjs     Reporte de datos a confirmar
```

## Editar contenido

Con `npm run dev`, en <http://127.0.0.1:4321/keystatic>:

- **Configuración del sitio**: nombre, WhatsApp, Instagram, dirección, mapa, Mercado Pago, analítica y el modo propuesta.
- **Datos del complejo**: textos de portada, las dos panorámicas (día y noche), títulos de cada sección, el spa, la zona, los momentos del fin de semana, las opciones del formulario, condiciones y cómo llegar.
- **Cabañas**: nombre, capacidad, lo que la hace distinta, hasta 4 detalles con ícono y sus fotos (la primera va en la ficha).
- **Testimonios** y **Preguntas frecuentes**.

En los títulos, lo que va entre guiones bajos sale en itálica: `Pensadas _para dos_`. Lo que no se sabe se escribe `[a confirmar]` y queda marcado en el sitio.

El panel guarda en los archivos del repo: después de editar, hay que hacer commit y push para publicar.

## Publicar en Cloudflare Pages

Una vez, desde el navegador (5 minutos):

1. Subí el repo a GitHub (`felitonelli/360-cumbre`):

   ```bash
   git push -u origin main
   ```

2. En <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git**. Autorizá GitHub y elegí `360-cumbre`.
3. Configuración del build:
   - **Project name:** `cabanas-360-cumbre` (queda en `cabanas-360-cumbre.pages.dev`).
   - **Production branch:** `main`.
   - **Framework preset:** Astro.
   - **Build command:** `npm run build`.
   - **Build output directory:** `dist`.
   - La versión de Node la toma de `.nvmrc` (22). Si el build se queja, sumá la variable `NODE_VERSION` = `22`.
4. **Save and Deploy.**

Desde ahí, cada push a `main` publica solo, y cada rama tiene su propia dirección de vista previa (sirve para el video).

Lo que hace el build en Cloudflare, sin tocar nada:

- `urlSitio` vacío en `site.json` → usa la dirección del proyecto.
- Escribe `dist/_headers` con caché larga para `/_astro/*` y, en modo propuesta, `X-Robots-Tag: noindex, nofollow` en todo el sitio.
- En modo propuesta, `robots.txt` bloquea todo y no hay sitemap.

**Dominio propio**, cuando sean clientes: en el proyecto → **Custom domains** → **Set up a domain**, y completá `urlSitio` en `site.json`.

## Rendimiento

Lighthouse 12.8 en modo móvil, contra el build local (`npm run preview`), el 28/10/2026, en modo propuesta y con las fotos de banco:

| | Resultado |
|---|---|
| Rendimiento | 98 |
| Accesibilidad | 100 |
| Buenas prácticas | 100 |
| SEO | 69 |

FCP 1,2 s · LCP 2,3 s · TBT 0 ms · CLS 0. El SEO da 69 a propósito: la única falla es el `noindex`, que es justamente lo que pide la propuesta. Con `modoPropuesta` en `false` se va.

Es una medición local, sin compresión ni HTTP/2. Después del deploy conviene repetirla en <https://pagespeed.web.dev> con la URL real. El reporte completo queda en `.lighthouse/` (no se sube al repo).

Lo que se cuidó para llegar:

- **Panorámica.** El celular pide como máximo una versión de 1600 px en AVIF (unos 45 kB), con `fetchpriority="high"`. La foto del otro modo no se baja hasta que se toca el interruptor.
- **Sin parpadeo.** El modo se decide en el `<head>`, antes de pintar.
- **Animación barata.** La panorámica se mueve con `transform` y se frena cuando no está en pantalla. No hay librerías de animación ni video.
- **Tipografía.** Tres archivos de unos 24 kB: Cormorant en un peso, normal e itálica, y Manrope variable.
- **CSS y JS.** El CSS va dentro del HTML. React y Keystatic existen solo en desarrollo.
- **Resto.** Fotos en AVIF con respaldo WebP y `loading="lazy"`. El mapa de Google se carga recién cuando el visitante lo pide.

## Antes de dar algo por terminado

```bash
npm run check
```

```bash
npm run build
```
