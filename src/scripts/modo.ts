// Interruptor día / noche. El modo inicial lo pone el <head> antes de pintar
// (ver Base.astro); acá se cambia, se recuerda y se avisa al resto de la página
// con el evento "cambio-de-modo" (la portada lo usa para cambiar la foto).
import { colorNavegador } from '../config/tema.mjs';
import { registrar } from './analitica';

export type Modo = 'dia' | 'noche';

const raiz = document.documentElement;

export const modoActual = (): Modo => (raiz.dataset.modo === 'dia' ? 'dia' : 'noche');

function guardado(): string | null {
  try {
    return localStorage.getItem('modo');
  } catch {
    return null;
  }
}

function reflejar(modo: Modo) {
  document.querySelectorAll('[data-interruptor]').forEach((boton) => {
    boton.setAttribute('aria-pressed', String(modo === 'noche'));
  });
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = colorNavegador[modo];
}

function cambiar(modo: Modo, recordar: boolean) {
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    raiz.classList.add('cambiando-modo');
    setTimeout(() => raiz.classList.remove('cambiando-modo'), 600);
  }
  raiz.dataset.modo = modo;
  if (recordar) {
    try {
      localStorage.setItem('modo', modo);
    } catch {
      // Sin almacenamiento (modo privado, permisos): el cambio vale para esta visita.
    }
  }
  reflejar(modo);
  document.dispatchEvent(new CustomEvent<Modo>('cambio-de-modo', { detail: modo }));
}

reflejar(modoActual());

document.querySelectorAll('[data-interruptor]').forEach((boton) =>
  boton.addEventListener('click', () => {
    const modo = modoActual() === 'noche' ? 'dia' : 'noche';
    cambiar(modo, true);
    registrar('modo_cambiado', { modo });
  }),
);

// Mientras el visitante no elija, la página acompaña los cambios del sistema.
matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!guardado()) cambiar(e.matches ? 'dia' : 'noche', false);
});
