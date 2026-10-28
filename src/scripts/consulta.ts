// Formulario "Consultar disponibilidad": valida las fechas, cuenta las noches
// y abre WhatsApp con el mensaje ya escrito. No envía nada a ningún servidor.
import { registrar } from './analitica';

const DIA = 24 * 60 * 60 * 1000;

interface Consulta {
  ingreso: Date;
  salida: Date;
  personas: number;
  cabana: string;
  /** Frase lista para el mensaje ("Es por nuestro aniversario."), o vacía. */
  ocasion: string;
  comentario: string;
}

/** "2026-01-15" → fecha local (sin el corrimiento de zona horaria de new Date(texto)). */
function aFecha(valor: string): Date | null {
  const [anio, mes, dia] = valor.split('-').map(Number);
  return anio && mes && dia ? new Date(anio, mes - 1, dia) : null;
}

const dos = (n: number) => String(n).padStart(2, '0');

function aValor(fecha: Date): string {
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`;
}

function sumarDias(fecha: Date, dias: number): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + dias);
}

function hoy(): Date {
  const ahora = new Date();
  return new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
}

export function noches(ingreso: Date, salida: Date): number {
  return Math.round((salida.getTime() - ingreso.getTime()) / DIA);
}

const plural = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`;

/** 15/01, y con el año solo si no es el actual. */
function corta(fecha: Date): string {
  const texto = `${dos(fecha.getDate())}/${dos(fecha.getMonth() + 1)}`;
  return fecha.getFullYear() === new Date().getFullYear() ? texto : `${texto}/${fecha.getFullYear()}`;
}

export function armarMensaje(c: Consulta): string {
  const estadia = plural(noches(c.ingreso, c.salida), 'noche', 'noches');
  let mensaje = `Hola! Quería consultar disponibilidad del ${corta(c.ingreso)} al ${corta(c.salida)} (${estadia}) para ${plural(c.personas, 'persona', 'personas')}`;
  mensaje += c.cabana ? `, en ${c.cabana}.` : '.';
  if (c.ocasion) mensaje += ` ${c.ocasion}`;
  mensaje += ' ¿Tienen lugar?';
  if (c.comentario) mensaje += `\n\n${c.comentario}`;
  return mensaje;
}

function iniciar(form: HTMLFormElement) {
  const campo = <T extends HTMLElement>(nombre: string) => form.elements.namedItem(nombre) as T;
  const ingreso = campo<HTMLInputElement>('ingreso');
  const salida = campo<HTMLInputElement>('salida');
  const resumen = form.querySelector<HTMLElement>('[data-resumen]')!;
  const error = form.querySelector<HTMLElement>('[data-error]')!;
  const aviso = form.querySelector<HTMLElement>('[data-aviso]')!;

  const minimo = Number(form.dataset.minimo) || 1;

  ingreso.min = aValor(hoy());
  salida.min = aValor(sumarDias(hoy(), 1));

  const leer = () => ({
    ingreso: aFecha(ingreso.value),
    salida: aFecha(salida.value),
    personas: Number(campo<HTMLSelectElement>('personas').value),
    cabana: campo<HTMLSelectElement>('cabana').value,
    ocasion: (form.elements.namedItem('ocasion') as RadioNodeList | null)?.value ?? '',
    comentario: campo<HTMLTextAreaElement>('comentario').value.trim(),
  });

  /** Devuelve el motivo por el que no se puede enviar, o null si está todo bien. */
  const validar = (c: ReturnType<typeof leer>): string | null => {
    if (!c.ingreso || !c.salida) return 'Elegí la fecha de llegada y la de salida.';
    if (c.ingreso < hoy()) return 'La fecha de llegada ya pasó.';
    if (c.salida <= c.ingreso) return 'La salida tiene que ser posterior a la llegada.';
    return null;
  };

  const mostrar = (elemento: HTMLElement, texto: string | null) => {
    elemento.textContent = texto ?? '';
    elemento.hidden = !texto;
  };

  const actualizar = () => {
    const c = leer();
    const valida = c.ingreso && c.salida && !validar(c);
    resumen.textContent = valida ? `${plural(noches(c.ingreso!, c.salida!), 'noche', 'noches')} en las sierras` : '';
    if (valida) mostrar(error, null);
    const corta = valida && noches(c.ingreso!, c.salida!) < minimo;
    mostrar(aviso, corta ? `La estadía mínima es de ${plural(minimo, 'noche', 'noches')}. Pueden consultar igual.` : null);
  };

  ingreso.addEventListener('change', () => {
    const desde = aFecha(ingreso.value);
    if (desde) {
      salida.min = aValor(sumarDias(desde, 1));
      const hasta = aFecha(salida.value);
      // Propone la salida según la estadía mínima si todavía no hay una válida.
      if (!hasta || hasta <= desde) salida.value = aValor(sumarDias(desde, Math.max(minimo, 1)));
    }
  });
  form.addEventListener('change', actualizar);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const c = leer();
    const motivo = validar(c);
    mostrar(error, motivo);
    if (motivo) {
      (c.ingreso ? salida : ingreso).focus();
      return;
    }

    const consulta = c as Consulta;
    const url = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(armarMensaje(consulta))}`;
    registrar('consulta_enviada', {
      noches: noches(consulta.ingreso, consulta.salida),
      personas: consulta.personas,
      cabana: consulta.cabana || 'me da igual',
      ocasion: Boolean(consulta.ocasion),
    });

    // Si el navegador bloquea la pestaña nueva, se abre en la misma.
    const ventana = window.open(url, '_blank');
    if (ventana) ventana.opener = null;
    else window.location.href = url;
  });
}

document.querySelectorAll<HTMLFormElement>('[data-consulta]').forEach(iniciar);
