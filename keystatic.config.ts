import { collection, config, fields, singleton } from '@keystatic/core';
import { OPCIONES_ICONO } from './src/config/iconos';

// Panel de contenido. Corre solo en desarrollo (npm run dev → /keystatic) y
// guarda todo en archivos dentro de src/config y src/content.

const FOTOS = 'src/assets/fotos';
// Las rutas que quedan en el YAML son relativas al archivo de contenido,
// así Astro puede optimizar las fotos con astro:assets.
const foto = (carpeta: string, label = 'Foto', description?: string) =>
  fields.image({
    label,
    description,
    directory: `${FOTOS}/${carpeta}`,
    publicPath: `../../assets/fotos/${carpeta}/`,
    validation: { isRequired: true },
  });

const orden = fields.integer({
  label: 'Orden',
  description: 'Los números más bajos aparecen primero.',
  defaultValue: 10,
});

const icono = (defaultValue: (typeof OPCIONES_ICONO)[number]['value'] = 'check') =>
  fields.select({ label: 'Ícono', options: OPCIONES_ICONO, defaultValue });

const seccion = (label: string) =>
  fields.object(
    {
      sobretitulo: fields.text({ label: 'Sobretítulo', description: 'La línea chica arriba del título.' }),
      titulo: fields.text({ label: 'Título', description: 'Lo que escribas entre guiones bajos sale en itálica: Pensadas _para dos_' }),
      texto: fields.text({ label: 'Texto de introducción', multiline: true }),
    },
    { label },
  );

const PENDIENTE = 'Si falta el dato, escribí [a confirmar] y queda resaltado en el sitio.';

export default config({
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Panel de contenido' },
    navigation: {
      Sitio: ['configuracion', 'complejo'],
      Alojamiento: ['cabanas'],
      Opiniones: ['testimonios'],
      Ayuda: ['faq'],
    },
  },

  singletons: {
    configuracion: singleton({
      label: 'Configuración del sitio',
      path: 'src/config/site',
      format: { data: 'json' },
      schema: {
        modoPropuesta: fields.checkbox({
          label: 'Modo propuesta',
          description:
            'Activado: muestra la banda "Propuesta de diseño", bloquea a los buscadores y no genera sitemap. Desactivalo recién cuando el sitio sea el oficial.',
          defaultValue: true,
        }),
        nombre: fields.text({ label: 'Nombre del complejo', validation: { isRequired: true } }),
        nombreCorto: fields.text({
          label: 'Nombre corto',
          description: 'Va grande en la portada, en el encabezado y en el pie. La primera palabra va derecha y el resto en itálica.',
          validation: { isRequired: true },
        }),
        eslogan: fields.text({ label: 'Eslogan', description: 'Para Google, las redes y el pie.' }),
        urlSitio: fields.text({
          label: 'Dirección web del sitio',
          description:
            'Con https:// y sin barra final. Se usa para el sitemap y para compartir en redes. Vacío: en Vercel y Cloudflare Pages se detecta sola; completalo cuando haya dominio propio.',
        }),
        whatsapp: fields.text({
          label: 'WhatsApp',
          description: 'Solo números, con código de país y sin el +. Ejemplo: 5493435551234',
          validation: { isRequired: true, pattern: { regex: /^\d{10,15}$/, message: 'Solo números, entre 10 y 15 dígitos.' } },
        }),
        instagram: fields.text({ label: 'Usuario de Instagram', description: 'Sin la arroba.' }),
        facebook: fields.object(
          {
            nombre: fields.text({ label: 'Nombre de la página' }),
            url: fields.text({ label: 'Link a la página' }),
          },
          { label: 'Facebook' },
        ),
        direccion: fields.object(
          {
            calle: fields.text({ label: 'Calle / ruta y altura' }),
            localidad: fields.text({ label: 'Localidad' }),
            departamento: fields.text({ label: 'Departamento o ciudad' }),
            provincia: fields.text({ label: 'Provincia' }),
            codigoPostal: fields.text({ label: 'Código postal' }),
          },
          { label: 'Dirección' },
        ),
        coordenadas: fields.object(
          {
            lat: fields.number({ label: 'Latitud', step: 0.000001, validation: { isRequired: true, min: -90, max: 90 } }),
            lng: fields.number({ label: 'Longitud', step: 0.000001, validation: { isRequired: true, min: -180, max: 180 } }),
          },
          { label: 'Coordenadas', description: 'Las del pin de Google Maps. Se usan para los buscadores.' },
        ),
        mapa: fields.object(
          {
            consulta: fields.text({
              label: 'Búsqueda en Google Maps',
              description: 'Nombre del lugar tal como aparece en Google Maps. Si lo dejás vacío se usan las coordenadas.',
            }),
            zoom: fields.integer({ label: 'Zoom del mapa', defaultValue: 14, validation: { min: 8, max: 19 } }),
          },
          { label: 'Mapa' },
        ),
        resenasGoogle: fields.object(
          {
            puntaje: fields.text({ label: 'Puntaje', description: 'Ejemplo: 4,6. Vacío para no mostrarlo.' }),
            cantidad: fields.text({ label: 'Cantidad de opiniones', description: 'Ejemplo: más de 170' }),
            url: fields.text({ label: 'Link a las reseñas', description: 'Vacío: lleva a la ficha de Google Maps.' }),
          },
          { label: 'Reseñas de Google' },
        ),
        mercadoPago: fields.object(
          {
            activo: fields.checkbox({ label: 'Mostrar el botón "Pagar seña con Mercado Pago"', defaultValue: false }),
            link: fields.text({ label: 'Link de pago', description: 'El que genera Mercado Pago (mpago.la/… o link.mercadopago.com.ar/…).' }),
          },
          { label: 'Seña online' },
        ),
        analitica: fields.object(
          {
            activa: fields.checkbox({ label: 'Medir clics en WhatsApp y consultas enviadas', defaultValue: false }),
            ga4Id: fields.text({ label: 'ID de Google Analytics 4', description: 'Ejemplo: G-XXXXXXXXXX' }),
            plausibleDominio: fields.text({ label: 'Dominio en Plausible', description: 'Alternativa liviana a GA4. Ejemplo: tucomplejo.com.ar' }),
          },
          { label: 'Analítica' },
        ),
        credito: fields.object(
          {
            nombre: fields.text({ label: 'Nombre' }),
            url: fields.text({ label: 'Link' }),
          },
          { label: 'Crédito del pie ("Sitio hecho por…")' },
        ),
      },
    }),

    complejo: singleton({
      label: 'Datos del complejo',
      path: 'src/content/sitio/complejo',
      format: { data: 'yaml' },
      schema: {
        seo: fields.object(
          {
            titulo: fields.text({ label: 'Título', description: 'Lo que aparece en la pestaña y en Google. Hasta 60 caracteres.' }),
            descripcion: fields.text({ label: 'Descripción', description: 'El texto gris de Google. Hasta 155 caracteres.', multiline: true }),
          },
          { label: 'Buscadores (SEO)' },
        ),
        portadaUbicacion: fields.text({ label: 'Portada: ubicación', description: 'La línea chica arriba del nombre.' }),
        portadaTexto: fields.text({ label: 'Portada: frase', description: 'Una sola oración, debajo del nombre.', multiline: true }),
        fotoPortadaDia: foto(
          'sitio',
          'Portada: panorámica de día',
          'Horizontal y bien ancha, de 3000 px o más. Se recorre de costado, así que conviene que tenga sierras de punta a punta.',
        ),
        fotoPortadaDiaAlt: fields.text({ label: 'Portada de día: descripción de la foto' }),
        fotoPortadaNoche: foto('sitio', 'Portada: panorámica de noche', 'Atardecer o noche. Misma medida que la de día.'),
        fotoPortadaNocheAlt: fields.text({ label: 'Portada de noche: descripción de la foto' }),
        secciones: fields.object(
          {
            cabanas: seccion('Las cabañas'),
            spa: seccion('El spa'),
            zona: seccion('La zona'),
            finde: seccion('Un fin de semana'),
            testimonios: seccion('Lo que dicen los huéspedes'),
            faq: seccion('Preguntas frecuentes'),
            comoLlegar: seccion('Cómo llegar'),
            consulta: seccion('Consultar disponibilidad'),
          },
          { label: 'Títulos e introducciones de cada sección' },
        ),
        spa: fields.object(
          {
            puntos: fields.array(
              fields.object({
                titulo: fields.text({ label: 'Título', validation: { isRequired: true } }),
                texto: fields.text({ label: 'Texto', description: PENDIENTE, multiline: true }),
              }),
              { label: 'Datos del spa', itemLabel: (props) => props.fields.titulo.value || 'Sin título' },
            ),
            foto: foto('sitio', 'Foto del spa'),
            fotoAlt: fields.text({ label: 'Descripción de la foto' }),
          },
          { label: 'El spa' },
        ),
        zona: fields.object(
          {
            puntos: fields.array(
              fields.object({
                icono: icono('map-pin'),
                titulo: fields.text({ label: 'Título', validation: { isRequired: true } }),
                texto: fields.text({ label: 'Texto', description: PENDIENTE, multiline: true }),
              }),
              { label: 'Qué hay cerca', itemLabel: (props) => props.fields.titulo.value || 'Sin título' },
            ),
            foto: foto('sitio', 'Foto de la zona'),
            fotoAlt: fields.text({ label: 'Descripción de la foto' }),
          },
          { label: 'La zona' },
        ),
        finde: fields.array(
          fields.object({
            cuando: fields.text({ label: 'Cuándo', description: 'Ejemplo: Viernes a la tarde.' }),
            titulo: fields.text({ label: 'Momento', validation: { isRequired: true } }),
            texto: fields.text({ label: 'Texto', description: PENDIENTE, multiline: true }),
            foto: foto('finde'),
            fotoAlt: fields.text({ label: 'Descripción de la foto' }),
          }),
          {
            label: 'Un fin de semana: momentos',
            description: 'La línea de tiempo. Entre 4 y 6 momentos.',
            itemLabel: (props) => props.fields.titulo.value || 'Sin título',
          },
        ),
        consulta: fields.object(
          {
            maximoPersonas: fields.integer({
              label: 'Máximo de personas en el formulario',
              defaultValue: 2,
              validation: { min: 1, max: 20 },
            }),
            notaPersonas: fields.text({ label: 'Aclaración debajo de "Personas"', description: PENDIENTE }),
            ocasiones: fields.array(
              fields.object({
                nombre: fields.text({ label: 'Opción', validation: { isRequired: true } }),
                frase: fields.text({ label: 'Frase en el mensaje', description: 'Ejemplo: Es por nuestro aniversario.' }),
              }),
              {
                label: '¿Es una ocasión especial?: opciones',
                itemLabel: (props) => props.fields.nombre.value || 'Sin nombre',
              },
            ),
          },
          { label: 'Formulario de consulta' },
        ),
        condiciones: fields.object(
          {
            sena: fields.text({ label: 'Seña y saldo', description: PENDIENTE, multiline: true }),
            estadiaMinima: fields.integer({
              label: 'Estadía mínima (noches)',
              description: 'El formulario avisa si la consulta es por menos noches.',
              defaultValue: 1,
              validation: { min: 1 },
            }),
            checkIn: fields.text({ label: 'Horario de ingreso', description: PENDIENTE }),
            checkOut: fields.text({ label: 'Horario de salida', description: PENDIENTE }),
          },
          { label: 'Condiciones de reserva' },
        ),
        comoLlegar: fields.array(
          fields.object({
            desde: fields.text({ label: 'Desde', validation: { isRequired: true } }),
            texto: fields.text({ label: 'Indicaciones', description: PENDIENTE, multiline: true }),
          }),
          {
            label: 'Cómo llegar: referencias de acceso',
            itemLabel: (props) => props.fields.desde.value || 'Sin título',
          },
        ),
      },
    }),
  },

  collections: {
    cabanas: collection({
      label: 'Cabañas',
      path: 'src/content/cabanas/*',
      slugField: 'nombre',
      format: { data: 'yaml' },
      columns: ['capacidad', 'orden'],
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre' } }),
        capacidad: fields.integer({
          label: 'Capacidad (personas)',
          description: 'Vacío: el sitio muestra "[a confirmar]".',
          defaultValue: 2,
          validation: { min: 1 },
        }),
        resumen: fields.text({ label: 'Lo que la hace distinta', description: 'Una o dos oraciones.', multiline: true }),
        detalles: fields.array(
          fields.object({
            icono: icono(),
            texto: fields.text({ label: 'Texto', validation: { isRequired: true } }),
          }),
          {
            label: 'Detalles',
            description: 'Entre 3 y 4: lo primero que tiene que saber una pareja.',
            itemLabel: (props) => props.fields.texto.value || 'Detalle',
            validation: { length: { max: 4 } },
          },
        ),
        fotos: fields.array(
          fields.object({
            foto: foto('cabanas'),
            alt: fields.text({ label: 'Descripción de la foto' }),
          }),
          {
            label: 'Fotos',
            description: 'La primera es la de la ficha; el resto se ve en la galería.',
            itemLabel: (props) => props.fields.alt.value || 'Foto',
            validation: { length: { min: 1 } },
          },
        ),
        orden,
      },
    }),

    testimonios: collection({
      label: 'Testimonios',
      path: 'src/content/testimonios/*',
      slugField: 'nombre',
      format: { data: 'yaml' },
      columns: ['origen', 'esEjemplo'],
      schema: {
        nombre: fields.slug({ name: { label: 'Nombre' } }),
        origen: fields.text({ label: 'De dónde es / por qué vino', description: 'Ejemplo: Aniversario, desde Rosario' }),
        texto: fields.text({ label: 'Testimonio', multiline: true, validation: { isRequired: true } }),
        esEjemplo: fields.checkbox({
          label: 'Es un testimonio de ejemplo',
          description: 'Lo marca como "Ejemplo" en el sitio. Destildalo solo si es un testimonio real y tenés permiso para publicarlo.',
          defaultValue: true,
        }),
        orden,
      },
    }),

    faq: collection({
      label: 'Preguntas frecuentes',
      path: 'src/content/faq/*',
      slugField: 'pregunta',
      format: { data: 'yaml' },
      columns: ['orden'],
      schema: {
        pregunta: fields.slug({ name: { label: 'Pregunta' } }),
        respuesta: fields.text({ label: 'Respuesta', description: PENDIENTE, multiline: true, validation: { isRequired: true } }),
        orden,
      },
    }),
  },
});
