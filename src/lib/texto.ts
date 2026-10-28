const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };

function escapar(texto: string): string {
  return texto.replace(/[&<>"]/g, (c) => ESCAPES[c]);
}

/** Resalta los "[a confirmar …]" para que salten a la vista en la propuesta. */
export function resaltar(texto: string): string {
  return escapar(texto).replace(/\[a confirmar[^\]]*\]/gi, '<mark class="pendiente">$&</mark>');
}

/** Igual que `resaltar`, pero respeta los saltos de párrafo del CMS. */
export function parrafos(texto: string): string {
  return texto
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${resaltar(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

/** Versión sin marcas, para metadatos y atributos. */
export function sinPendientes(texto: string): string {
  return texto.replace(/\s*\[a confirmar[^\]]*\]/gi, '').trim();
}

/** Títulos del CMS: lo que va entre guiones bajos sale en itálica ("Pensadas _para dos_"). */
export function titular(texto: string): string {
  return resaltar(texto).replace(/_([^_]+)_/g, '<em>$1</em>');
}
