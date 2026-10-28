// Portada: la panorámica se recorre sola, despacio, y también con el dedo, el
// mouse, el trackpad o las flechas del teclado. El aro marca la posición.
// Con "reducir movimiento" no se mueve sola; a mano, sí.
import { modoActual, type Modo } from './modo';

const VELOCIDAD = 0.018; // px por milisegundo en el medio del recorrido
const PAUSA_TRAS_TOCAR = 2500; // ms quieta después de que el visitante la mueve
const PASO_TECLADO = 140; // px por flecha
const ARO = 69.1; // largo de la circunferencia del aro (2π · 11)

const panorama = document.querySelector<HTMLElement>('[data-panorama]');
const pista = document.querySelector<HTMLElement>('[data-pista]');
const aro = document.querySelector<SVGCircleElement>('[data-aro]');

if (panorama && pista) {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)');
  let recorrido = 0;
  let posicion = 0;
  let sentido = 1;
  let inercia = 0;
  let quietaHasta = performance.now() + 1200;
  let visible = true;
  let enPantalla = true;
  let corriendo = false;
  let centrada = false;
  let anterior = 0;
  // Los anchos los da el ResizeObserver, que mide después del layout: leerlos
  // a mano (offsetWidth) obligaría al navegador a recalcular la página.
  const ancho = { panorama: 0, pista: 0 };

  const medir = () => {
    recorrido = Math.max(0, ancho.pista - ancho.panorama);
    // Arranca centrada: es la parte de la foto que mejor queda.
    if (!centrada && recorrido) {
      posicion = recorrido / 2;
      centrada = true;
    }
    posicion = Math.min(posicion, recorrido);
  };

  const pintar = () => {
    pista.style.transform = `translate3d(${-posicion}px, 0, 0)`;
    if (aro && recorrido) aro.style.strokeDashoffset = String(ARO * (1 - posicion / recorrido));
  };

  const mover = (px: number) => {
    posicion = Math.min(recorrido, Math.max(0, posicion + px));
  };

  function cuadro(ahora: number) {
    const dt = anterior ? Math.min(ahora - anterior, 64) : 0;
    anterior = ahora;
    if (inercia) {
      mover(inercia * dt);
      inercia *= 0.94;
      if (Math.abs(inercia) < 0.01) inercia = 0;
    } else if (!reducir.matches && ahora > quietaHasta && recorrido) {
      // Más lenta cerca de las puntas, y ahí da la vuelta.
      const t = posicion / recorrido;
      mover(sentido * VELOCIDAD * dt * (0.25 + 0.75 * Math.sin(Math.PI * t)));
      if (posicion >= recorrido) sentido = -1;
      if (posicion <= 0) sentido = 1;
    }
    pintar();
    if (visible) requestAnimationFrame(cuadro);
    else corriendo = false;
  }

  const reanudar = () => {
    if (corriendo) return;
    corriendo = true;
    anterior = 0;
    requestAnimationFrame(cuadro);
  };

  // Arrastrar con el dedo o el mouse. touch-action: pan-y deja el scroll
  // vertical en manos del navegador.
  let arrastre: { x: number; posicion: number; ultimoX: number; ultimoT: number; velocidad: number } | null = null;

  panorama.addEventListener('pointerdown', (e) => {
    arrastre = { x: e.clientX, posicion, ultimoX: e.clientX, ultimoT: e.timeStamp, velocidad: 0 };
    inercia = 0;
    panorama.setPointerCapture(e.pointerId);
  });

  panorama.addEventListener('pointermove', (e) => {
    if (!arrastre) return;
    posicion = Math.min(recorrido, Math.max(0, arrastre.posicion - (e.clientX - arrastre.x)));
    const dt = e.timeStamp - arrastre.ultimoT;
    if (dt > 0) arrastre.velocidad = -(e.clientX - arrastre.ultimoX) / dt;
    arrastre.ultimoX = e.clientX;
    arrastre.ultimoT = e.timeStamp;
    quietaHasta = performance.now() + PAUSA_TRAS_TOCAR;
  });

  const soltar = () => {
    if (!arrastre) return;
    inercia = Math.max(-3, Math.min(3, arrastre.velocidad));
    if (inercia) sentido = Math.sign(inercia);
    arrastre = null;
    quietaHasta = performance.now() + PAUSA_TRAS_TOCAR;
  };
  panorama.addEventListener('pointerup', soltar);
  panorama.addEventListener('pointercancel', soltar);

  // Trackpad o rueda con desplazamiento horizontal.
  panorama.addEventListener(
    'wheel',
    (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      mover(e.deltaX);
      quietaHasta = performance.now() + PAUSA_TRAS_TOCAR;
    },
    { passive: false },
  );

  panorama.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    inercia = (e.key === 'ArrowRight' ? 1 : -1) * (PASO_TECLADO / 260);
    quietaHasta = performance.now() + PAUSA_TRAS_TOCAR * 2;
  });

  // Fuera de pantalla o con la pestaña oculta, no gasta nada.
  const actualizar = () => {
    visible = enPantalla && !document.hidden;
    if (visible) reanudar();
  };
  new IntersectionObserver(([entrada]) => {
    enPantalla = entrada.isIntersecting;
    actualizar();
  }).observe(panorama);
  document.addEventListener('visibilitychange', actualizar);

  const observador = new ResizeObserver((entradas) => {
    for (const e of entradas) {
      ancho[e.target === pista ? 'pista' : 'panorama'] = e.borderBoxSize?.[0]?.inlineSize ?? e.contentRect.width;
    }
    medir();
    pintar();
  });
  observador.observe(panorama);
  observador.observe(pista);

  reanudar();

  // ---------- Cambio de foto con el modo ----------

  const fotoDelSistema = (): Modo => (matchMedia('(prefers-color-scheme: light)').matches ? 'dia' : 'noche');

  function mostrarFoto(modo: Modo) {
    const fotos = pista!.querySelectorAll<HTMLElement>('[data-foto-portada]');
    const ultima = fotos[fotos.length - 1];
    const modoUltima = ultima.dataset.modoFoto === 'sistema' ? fotoDelSistema() : ultima.dataset.modoFoto;
    panorama!.setAttribute('aria-label', panorama!.dataset[modo === 'dia' ? 'altDia' : 'altNoche'] ?? '');
    if (modoUltima === modo) return;

    const plantilla = document.querySelector<HTMLTemplateElement>(`[data-plantilla-portada="${modo}"]`);
    const nueva = plantilla?.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
    if (!nueva) return;
    pista!.append(nueva);

    const entrar = () =>
      requestAnimationFrame(() => {
        nueva.classList.add('entrando');
        setTimeout(() => {
          pista!.querySelectorAll('[data-foto-portada]').forEach((foto) => foto !== nueva && foto.remove());
        }, 950);
      });
    nueva.querySelector('img')?.decode().then(entrar, entrar);
  }

  mostrarFoto(modoActual());
  document.addEventListener('cambio-de-modo', (e) => mostrarFoto((e as CustomEvent<Modo>).detail));
}
