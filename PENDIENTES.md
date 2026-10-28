# Pendientes

Todo lo que en el sitio dice `[a confirmar]` sale de acá. `npm run pendientes` lista los que quedan en el contenido.

Lo que se sabe hoy viene del Instagram público (@360_cumbre, ~9.000 seguidores) y del Linktree: "casas de montaña para parejas", en El Durazno (Villa Yacanto, Calamuchita), en el mismo predio que el Spa Termas del Sol. **Todo eso también hay que confirmarlo.**

## Preguntas para la videollamada con los dueños

Ordenadas para hacerlas de corrido. Las marcadas con ★ son las que más cambian el sitio.

### Las casas

1. ★ ¿Cuántas casas son y cómo se llama cada una? (Hoy figuran como "Casa uno" y "Casa dos").
2. ★ ¿Son todas para 2 personas? ¿Se puede sumar a alguien (una tercera persona, un bebé)? Si se puede, el formulario deja elegir más.
3. ★ ¿Qué hace distinta a cada casa? Una o dos frases por casa.
4. ¿Qué tiene cada una? Tamaño de la cama, deck y vista, hogar, salamandra o calefacción, cocina, hidromasaje o jacuzzi, Wi-Fi, TV, aire acondicionado.
5. ¿Hay fogón en cada casa? ¿Dan la leña?
6. ¿Incluye desayuno? ¿Ropa blanca y toallas?

### El Spa Termas del Sol

7. ★ ¿El spa está en el mismo predio que las casas? ¿Es de ustedes o de otros dueños?
8. ★ Para los huéspedes, ¿el acceso está incluido, tiene descuento o se paga aparte?
9. ¿Qué tiene el spa (piletas climatizadas, sauna, masajes…) y en qué horarios abre? ¿Hay que reservar turno?
10. ¿Podemos usar el nombre "Spa Termas del Sol" y fotos del spa en el sitio?

### Reservas

11. ★ Tarifas: ¿cambian por temporada, fin de semana largo o día de la semana?
12. ★ Seña: ¿cuánto (porcentaje o monto) y cómo se paga? ¿Les sirve el botón de pago de seña con Mercado Pago? (Ya está armado y apagado).
13. Formas de pago del saldo.
14. Horario de ingreso y de salida. ¿Se puede hacer late check-out?
15. Estadía mínima (en temporada y en fines de semana largos).
16. Política de cancelación.
17. ¿Aceptan mascotas?

### Ubicación

18. ★ Ubicación exacta de las casas. Hoy el mapa usa la del Spa Termas del Sol que figura en OpenStreetMap (-32,17416, -64,76826).
19. Cómo llegar desde Córdoba capital y desde Villa General Belgrano: ruta y tiempo de viaje.
20. El último tramo: ¿es de tierra? ¿Se llega con cualquier auto?
21. Distancias: al río, a Villa Yacanto y a las excursiones al Champaquí.
22. ¿Hay señal de celular y Wi-Fi en las casas?

### Fotos, marca y contacto

23. ★ ¿Nos dan permiso para usar las fotos de su Instagram? Son muy buenas y reemplazan a las de banco de imágenes. Ideal: los originales en alta resolución y una panorámica ancha tomada desde el complejo para la portada.
24. El logo en vector (SVG, PDF o AI). No se usa mientras sea una propuesta.
25. ¿Cómo prefieren que figure el nombre: "Cabañas 360 Cumbre", "360 Cumbre" o "Cabañas El Durazno" (como dice el perfil)?
26. El número de WhatsApp para las consultas.
27. ¿Tienen reseñas en Google, Booking o Airbnb? Con permiso, reemplazan los testimonios de ejemplo. ¿Puntaje y cantidad en Google?
28. ¿Facebook? ¿Tienen dominio propio o hay que comprarlo (por ejemplo, `360cumbre.com.ar`)?

## Para vos, antes de mostrarla

- [ ] Hacer el deploy en Cloudflare Pages (pasos en el [README](README.md#publicar-en-cloudflare-pages)).
- [ ] Completar `credito.url` en `src/config/site.json` con tu link, para el "Sitio hecho por Felipe" del pie.
- [ ] Confirmar que `5493430000000` sirve para la demo: si ese número no tiene WhatsApp, la app avisa que el número no es válido. Para el video conviene tu número real (ver [GUION-VIDEO.md](GUION-VIDEO.md)).
- [ ] Grabar el video siguiendo [GUION-VIDEO.md](GUION-VIDEO.md).
- [ ] Repetir Lighthouse con la URL publicada en <https://pagespeed.web.dev>.

## Para pasar a sitio oficial

- [ ] Datos confirmados en el panel y `npm run pendientes` sin líneas.
- [ ] Fotos y logo del complejo, con permiso.
- [ ] WhatsApp real del complejo en `site.json`.
- [ ] `modoPropuesta` en `false`: saca la banda, el `noindex` y el aviso de fotos ilustrativas, y genera el sitemap.
- [ ] Dominio propio en Cloudflare Pages y `urlSitio` completo.
- [ ] Analítica, si la quieren (GA4 o Plausible, en `site.json`).
- [ ] Link de Mercado Pago, si van a cobrar la seña online.
