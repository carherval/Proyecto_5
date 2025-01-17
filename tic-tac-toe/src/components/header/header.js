import './header.css'

/**
 * Función que crea la cabecera
 * @param {String} gameTitle Título del juego
 * @param {Number} headerHeight Altura de la cabecera
 */
export function createHeaderTag(gameTitle, headerHeight) {
  document.title = gameTitle

  const header = document.querySelector('header')

  header.classList.add('flex', 'header')
  header.style = `height: ${headerHeight}rem;`
  header.innerHTML = `<h1>${gameTitle}</h1>`
}
