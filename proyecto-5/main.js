import './style.css'

import { createHeaderTag } from './src/components/header/header'

import { createFooterTag } from './src/components/footer/footer'

const HEADER_HEIGHT = 7.5
const FOOTER_HEIGHT = 7.5

const TITLE = 'Juegos'

// Listado de juegos
// Los identificadores tienen que coincidir con el nombre del fichero JS de cada juego
const GAMES = [
  { id: 'tic-tac-toe', title: '3 en raya' },
  { id: 'pairs', title: 'Parejas' },
  { id: 'simon', title: 'Simon' }
]

createHeaderTag(TITLE, HEADER_HEIGHT)
createMainTag()
createFooterTag(FOOTER_HEIGHT)

// Función que crea el menú
function createMainTag() {
  const main = document.querySelector('main')

  main.classList.add('flex', 'menu')
  main.style = `height: calc(100vh - ${
    HEADER_HEIGHT + FOOTER_HEIGHT
  }rem); overflow-y: auto;`
  main.innerHTML = getMenuContent()

  addMainTagListeners()
}

/**
 * Función que devuelve el contenido del menú
 * @returns Código HTML
 */
function getMenuContent() {
  let menuContent = '<nav><ul class="flex">'

  for (const game of GAMES) {
    menuContent += `<li><a class="flex btn-lnk" id="${game.id}" href="#">${game.title}</a></li>`
  }

  menuContent += '</ul></nav>'

  return menuContent
}

// Función que crea los eventos del menú
function addMainTagListeners() {
  for (const game of GAMES) {
    document
      .getElementById(game.id)
      .addEventListener('click', async function () {
        const gameModule = await import(
          /* @vite-ignore */ `/src/games/${game.id}/${game.id}`
        )

        document.querySelector('h1').innerHTML = document.title = game.title

        gameModule.createMainTag(HEADER_HEIGHT, FOOTER_HEIGHT)
      })
  }
}
