// Muestra con una transición los elementos marcados con data-aparece cuando
// entran en pantalla. La transición en sí es CSS (ver global.css); acá solo se
// decide el momento.
declare global {
  interface Window {
    /** El <head> lo consulta para destapar la página si este script no llegó a correr. */
    __aparecer?: boolean;
  }
}

const ESCALON = 80; // ms entre elementos que entran juntos
const MAXIMO = 5;

if ('IntersectionObserver' in window) {
  window.__aparecer = true;

  const observador = new IntersectionObserver(
    (entradas) => {
      // Los que entran a la vez (una fila de tarjetas) se escalonan.
      entradas
        .filter((entrada) => entrada.isIntersecting)
        .forEach((entrada, i) => {
          const elemento = entrada.target as HTMLElement;
          elemento.style.transitionDelay = `${Math.min(i, MAXIMO) * ESCALON}ms`;
          elemento.classList.add('visible');
          observador.unobserve(elemento);
        });
    },
    // Espera a que el elemento asome un poco antes de mostrarlo.
    { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
  );

  document.querySelectorAll('[data-aparece]').forEach((elemento) => observador.observe(elemento));
} else {
  document.documentElement.classList.remove('animar');
}

export {};
