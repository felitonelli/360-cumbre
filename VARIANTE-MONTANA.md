# Variante "montaña / premium"

Este repo es la propuesta de 360 Cumbre y, a la vez, la segunda variante visual de la plantilla de turismo. La primera es la de Alisos del Río y Los Naranjos (clara, con hojas apiladas y grilla de tarjetas). Esta es oscura, con día y noche, y apunta a complejos chicos y premium: parejas, montaña, escapadas.

| | Variante clásica (Alisos) | Variante montaña (este repo) |
|---|---|---|
| Fondo | Claro | Noche o día, a elección del visitante |
| Portada | Foto fija, texto abajo | Panorámica que se recorre, texto centrado |
| Cabañas | Tarjeta + distribución + equipamiento | Fichas grandes con foto en arco y galería propia |
| Secciones | Destacados, predio, tarifas, galería, zona | Spa (opcional), zona, línea de tiempo del fin de semana |
| Formulario | Sección al final, adultos / chicos / mascotas | Hoja que sube desde abajo, personas / cabaña / ocasión |
| Cortes | Esquinas redondeadas | Silueta de sierra |

La lógica es la misma: `site.json`, Keystatic, el formulario que arma el WhatsApp, el modo propuesta, SEO, analítica y las cabeceras de Cloudflare.

## Otra propuesta con esta variante

Lo propio de cada complejo vive en cuatro lugares; el resto no se toca.

| Se cambia | No se toca |
|---|---|
| `src/config/site.json` | `src/components/`, `src/layouts/`, `src/pages/` |
| `src/config/tema.css` (valores) y `tema.mjs` | `src/styles/global.css`, `src/scripts/`, `src/lib/` |
| `src/content/` | `keystatic.config.ts`, `src/content.config.ts` |
| `src/assets/fotos/` y los íconos de `public/` | `astro.config.mjs`, `scripts/` |

1. **Copiar.** Cloná la plantilla siguiendo el paso 1 de `NUEVO-COMPLEJO.md` y aplicá la variante con `npm run variante -- montana` (ver más abajo).
2. **Configuración.** `site.json`: nombre, nombre corto (va grande en la portada: la primera palabra derecha y el resto en itálica), WhatsApp de prueba, `modoPropuesta: true`, dirección y mapa.
3. **Colores.** En `tema.css` cambiá los valores de la paleta (`carbon`, `crema`, `cobre`, `ambar`, `salvia`, `piedra`), no los nombres. Los componentes usan funciones (`fondo`, `tinta`, `acento`, `boton`…) que toman un valor de día y otro de noche. Revisá el contraste en los dos modos: es lo primero que falla.
4. **Tipografías.** En `tema.mjs`. Para que no se parezca a esta: otra serif de títulos con itálica y otra sans de textos. Un solo peso de títulos.
5. **Contenido.** Desde el panel o en los YAML. Si el complejo no tiene spa, dejá vacío el título de la sección "El spa": no se muestra ni aparece en el menú. La sección de la zona y el fin de semana se adaptan a cualquier lugar.
6. **Fotos.** Dos panorámicas anchas para la portada (día y noche, 3000 px o más), entre 1 y 6 fotos por cabaña, una del spa, una de la zona y una por momento del fin de semana.
7. **Revisión.** `npm run check`, `npm run build`, 375 px y escritorio, día y noche, Lighthouse móvil.

## En la plantilla

La variante también está en la plantilla, en `variantes/montana/` de `alisos-del-rio-propuesta` (rama `variante-montana`, a partir de `plantilla-reutilizable`). Una propuesta nueva la toma de ahí con `npm run variante -- montana`, sin copiar este repo. Si acá se mejora un componente, la mejora se lleva también a esa carpeta.
