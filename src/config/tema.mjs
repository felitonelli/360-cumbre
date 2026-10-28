// Tipografías y detalles de estilo del complejo. Los colores están en tema.css.
// Lo leen astro.config.mjs (para bajar las fuentes) y los componentes.

/**
 * Nombres tal como figuran en https://fontsource.org.
 * Para los títulos conviene pedir un solo peso: una fuente variable completa
 * puede pesar más de 100 kB y frena la primera carga. La itálica se baja
 * aparte y solo cuando la página la usa.
 */
export const fuentes = {
  titulos: { nombre: 'Cormorant Garamond', pesos: [600], estilos: ['normal', 'italic'], respaldo: ['Georgia', 'serif'] },
  textos: { nombre: 'Manrope', pesos: ['400 700'], estilos: ['normal'], respaldo: ['system-ui', 'sans-serif'] },
};

/** Color de la barra del navegador en el celular, en cada modo. */
export const colorNavegador = { noche: '#1e1b18', dia: '#f3ede2' };

/**
 * Modo con el que abre la página si el visitante no eligió uno y su sistema
 * no pide modo claro. Después manda lo que elija con el interruptor.
 * @type {'noche' | 'dia'}
 */
export const modoPorDefecto = 'noche';
