// Ventanas (<dialog>) de la página: la hoja de consulta y las galerías.
// Se cierran con la X, con Escape o tocando afuera, y mientras están abiertas
// la página de atrás no se mueve.

export function abrir(dialogo: HTMLDialogElement) {
  if (dialogo.open) return;
  dialogo.showModal();
  document.documentElement.classList.add('con-dialogo');
}

export function cerrar(dialogo: HTMLDialogElement) {
  if (!dialogo.open) return;
  dialogo.classList.add('cerrando');
  const terminar = () => {
    dialogo.classList.remove('cerrando');
    dialogo.close();
  };
  // Si hay animación de salida, se espera a que termine.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) terminar();
  else setTimeout(terminar, 220);
}

document.querySelectorAll<HTMLDialogElement>('dialog[data-dialogo]').forEach((dialogo) => {
  dialogo.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('con-dialogo');
  });
  dialogo.addEventListener('cancel', (e) => {
    e.preventDefault();
    cerrar(dialogo);
  });
  // Un clic en el fondo oscuro llega al propio <dialog>, no a su contenido.
  dialogo.addEventListener('click', (e) => {
    if (e.target === dialogo) cerrar(dialogo);
  });
  dialogo.querySelectorAll('[data-cerrar]').forEach((boton) => boton.addEventListener('click', () => cerrar(dialogo)));
});
