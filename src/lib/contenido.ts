import { getCollection, getEntry } from 'astro:content';

type Ordenable = 'cabanas' | 'testimonios' | 'faq';

/** Singleton "Datos del complejo". */
export async function complejo() {
  const entrada = await getEntry('sitio', 'complejo');
  if (!entrada) throw new Error('Falta src/content/sitio/complejo.yaml');
  return entrada.data;
}

/** Entradas de una colección, según el campo "orden" del CMS. */
export async function ordenados<C extends Ordenable>(coleccion: C) {
  const entradas = await getCollection(coleccion);
  return entradas.sort((a, b) => a.data.orden - b.data.orden);
}
