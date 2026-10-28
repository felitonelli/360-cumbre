// Punto único para registrar eventos. Sin analítica activa no hace nada.
type Datos = Record<string, string | number | boolean>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (evento: string, opciones?: { props?: Datos }) => void;
  }
}

export function registrar(evento: string, datos: Datos = {}): void {
  if (document.documentElement.dataset.analitica !== 'on') return;
  window.gtag?.('event', evento, datos);
  window.plausible?.(evento, { props: datos });
}
