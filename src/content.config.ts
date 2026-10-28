import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Estos esquemas son el espejo de keystatic.config.ts: si agregás un campo
// allá, sumalo acá para poder usarlo en los componentes.

const yaml = (carpeta: string) => glob({ pattern: '*.yaml', base: `./src/content/${carpeta}` });

const texto = z.string().default('');
const orden = z.number().default(10);

const seccion = z.object({ sobretitulo: texto, titulo: texto, texto });

const sitio = defineCollection({
  loader: yaml('sitio'),
  schema: ({ image }) =>
    z.object({
      seo: z.object({ titulo: texto, descripcion: texto }),
      portadaUbicacion: texto,
      portadaTexto: texto,
      fotoPortadaDia: image(),
      fotoPortadaDiaAlt: texto,
      fotoPortadaNoche: image(),
      fotoPortadaNocheAlt: texto,
      secciones: z.object({
        cabanas: seccion,
        spa: seccion,
        zona: seccion,
        finde: seccion,
        testimonios: seccion,
        faq: seccion,
        comoLlegar: seccion,
        consulta: seccion,
      }),
      spa: z.object({
        puntos: z.array(z.object({ titulo: z.string(), texto })).default([]),
        foto: image(),
        fotoAlt: texto,
      }),
      zona: z.object({
        puntos: z.array(z.object({ icono: z.string(), titulo: z.string(), texto })).default([]),
        foto: image(),
        fotoAlt: texto,
      }),
      finde: z
        .array(z.object({ cuando: texto, titulo: z.string(), texto, foto: image(), fotoAlt: texto }))
        .default([]),
      consulta: z.object({
        maximoPersonas: z.number().default(2),
        notaPersonas: texto,
        ocasiones: z.array(z.object({ nombre: z.string(), frase: z.string() })).default([]),
      }),
      condiciones: z.object({
        sena: texto,
        estadiaMinima: z.number().default(1),
        checkIn: texto,
        checkOut: texto,
      }),
      comoLlegar: z.array(z.object({ desde: z.string(), texto })).default([]),
    }),
});

const cabanas = defineCollection({
  loader: yaml('cabanas'),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      capacidad: z.number().nullable().default(2),
      resumen: texto,
      detalles: z.array(z.object({ icono: z.string(), texto: z.string() })).default([]),
      fotos: z.array(z.object({ foto: image(), alt: texto })).min(1),
      orden,
    }),
});

const testimonios = defineCollection({
  loader: yaml('testimonios'),
  schema: z.object({
    nombre: z.string(),
    origen: texto,
    texto: z.string(),
    esEjemplo: z.boolean().default(true),
    orden,
  }),
});

const faq = defineCollection({
  loader: yaml('faq'),
  schema: z.object({
    pregunta: z.string(),
    respuesta: z.string(),
    orden,
  }),
});

export const collections = { sitio, cabanas, testimonios, faq };
