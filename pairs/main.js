import './style.css'

import { createHeaderTag } from './src/components/header/header'

import {
  STAT_LABELS,
  getButtonLink,
  getHiddenButtonLink,
  getStatsByProperty,
  deleteStats,
  saveStats
} from './src/components/game/stats/stats'

import {
  CARD_REVERSE,
  boardCard,
  board,
  cardPair,
  getGameBoardContent,
  printBoard,
  isFullCardPair,
  isSameCardInCardPair,
  getFlippedCards,
  resetBoard,
  resetCardPair
} from './src/components/game/board/board'

import {
  getRadioButtonInputGroup,
  getSubmitButton
} from './src/components/game/config/config'

import {
  getGameMessageContent,
  printMessage
} from './src/components/game/messages/messages'

import { createFooterTag } from './src/components/footer/footer'

// Mensajes emergentes de SweetAlert2
import Swal from 'sweetalert2'

const HEADER_HEIGHT = 7.5
const FOOTER_HEIGHT = 7.5

const GAME_TITLE = 'Parejas'
const NEW_GAME_LABEL = 'Nueva partida'
const NOT_STARTED_GAME_MSG = 'Partida no iniciada'

const DIFF_ID = 'diff'

// Indicador de si se quiere establecer el formato de tiempo con horas
const IS_HOURS = false
// Indicador de si se quiere establecer el formato de tiempo con décimas de segundo
const IS_TENTHS = true

// Cabeceras de las tablas de las estadísticas del juego
const STAT_HEADERS = {
  date: { id: 'date', title: 'Fecha' },
  time: { id: 'time', title: 'Tiempo' }
}

// Dificultades del juego
const DIFFICULTIES = {
  easy: {
    id: 'easy',
    title: 'Fácil',
    rows: 4,
    columns: 4,
    className: 's-size'
  },
  medium: {
    id: 'medium',
    title: 'Media',
    rows: 6,
    columns: 4,
    className: 'm-size'
  },
  hard: {
    id: 'hard',
    title: 'Difícil',
    rows: 8,
    columns: 4,
    className: 'l-size'
  }
}

// Cartas del juego
const CARDS = [
  { id: '3-raya', title: '3 en raya' },
  { id: 'arkanoid', title: 'Arkanoid' },
  { id: 'arrows', title: 'Teclas de flecha' },
  { id: 'auriculares', title: 'Auriculares' },
  { id: 'billar', title: 'Bolas de billar' },
  { id: 'bomba', title: 'Bomba' },
  { id: 'cartas', title: 'Cartas' },
  { id: 'cd', title: 'Compact Disc' },
  { id: 'dados', title: 'Dados' },
  { id: 'diamante', title: 'Diamante' },
  { id: 'escudo', title: 'Escudo' },
  { id: 'espadas', title: 'Espadas' },
  { id: 'flechas', title: 'Flechas' },
  { id: 'gameboy', title: 'Gameboy' },
  { id: 'game-over', title: 'Game Over' },
  { id: 'joystick', title: 'Joystick' },
  { id: 'laberinto', title: 'Laberinto' },
  { id: 'llave', title: 'Llave' },
  { id: 'mando', title: 'Mando de videojuego' },
  { id: 'mirilla', title: 'Mirilla telescópica' },
  { id: 'nes', title: 'Mando de Nes' },
  { id: 'pad', title: 'Cruceta de mando de videojuego' },
  { id: 'pc', title: 'Personal Computer' },
  { id: 'pistola', title: 'Pistola desintegradora' },
  { id: 'play', title: 'Botones de mando de PlayStation' },
  { id: 'pong', title: 'Pong' },
  { id: 'ps-one', title: 'PlayStation One' },
  { id: 'raton', title: 'Ratón' },
  { id: 'rv', title: 'Realidad Virtual' },
  { id: 'shooter', title: 'HUD de shooter' },
  { id: 'supernes', title: 'Mando de Supernes' },
  { id: 'tetris', title: 'Tetris' },
  { id: 'volante', title: 'Volante' },
  { id: 'vs', title: 'Modo versus' }
]

// Etiquetas para los mensajes emergentes
const DIALOG_LABELS = {
  accept: 'Aceptar',
  cancel: 'Cancelar'
}

// Resultado del juego
const gameTime = { start: null, end: null }

// Dificultad del juego
let gameDifficulty = DIFFICULTIES.medium.id
// Indicador de partida iniciada
let isStartedGame = false
// Intervalo para el contador de tiempo
let interval = null

createHeaderTag(GAME_TITLE, HEADER_HEIGHT)
createMainTag()
createFooterTag(FOOTER_HEIGHT)

// Función que crea la zona de juego
function createMainTag() {
  const main = document.querySelector('main')

  main.classList.add('flex', 'game')
  main.style = `height: calc(100vh - ${
    HEADER_HEIGHT + FOOTER_HEIGHT
  }rem); overflow-y: auto;`

  createBoard()

  main.innerHTML =
    getGameStatContent() +
    getGameConfigAndBoardContent() +
    getGameMessageContent()

  printBoard(DIFFICULTIES[gameDifficulty].className)
  addClassNameToDialog(DIFFICULTIES[gameDifficulty].className)

  document.getElementById(gameDifficulty).checked = true

  addMainTagListeners()
  printStats()
  printMessage(NOT_STARTED_GAME_MSG)
}

/**
 * Función que devuelve el contenido de las estadísticas del juego
 * @returns Código HTML
 */
function getGameStatContent() {
  return `${getStatButtonBoxContent()}${getStatTableContent()}`
}

/**
 * Función que devuelve el contenido de la botonera de las estadísticas del juego
 * @returns Código HTML
 */
function getStatButtonBoxContent() {
  return `<div class="flex">${getButtonLink(
    STAT_LABELS.view.id,
    STAT_LABELS.view.title
  )}${getHiddenButtonLink(
    STAT_LABELS.back.id,
    STAT_LABELS.back.title
  )}${getHiddenButtonLink(STAT_LABELS.del.id, STAT_LABELS.del.title)}</div>`
}

/**
 * Función que devuelve el contenido de las tablas de las estadísticas del juego
 * @returns Código HTML
 */
function getStatTableContent() {
  let statTables = '<section class="flex stats oculto">'

  for (const difficulty in DIFFICULTIES) {
    statTables += `<article class="flex" id="${DIFF_ID}-${difficulty}"><table summary="Estadísticas almacenadas de las partidas para la dificultad ${DIFFICULTIES[
      difficulty
    ].title.toLowerCase()}"><caption><h2>Dificultad ${DIFFICULTIES[
      difficulty
    ].title.toLowerCase()}</h2><span></span></caption><thead>${getStatHeaderRow(
      difficulty[0]
    )}</thead><tbody>${getNoStatsRow(difficulty[0])}</tbody></table></article>`
  }

  statTables += '</section>'

  return statTables
}

/**
 * Función que devuelve la cabecera de las tablas de las estadísticas del juego
 * @param {String} idPrefix Prefijo para el identificador de las cabeceras
 * @returns Código HTML
 */
function getStatHeaderRow(idPrefix) {
  let statHeaderRow = '<tr>'

  for (const statHeader in STAT_HEADERS) {
    statHeaderRow += `<th id="${idPrefix}-${statHeader}" scope="col">${STAT_HEADERS[statHeader].title}</th>`
  }

  statHeaderRow += '</tr>'

  return statHeaderRow
}

/**
 * Función que devuelve una fila vacía para las tablas de las estadísticas del juego
 * @param {String} idPrefix Prefijo para el identificador de las cabeceras
 * @returns Código HTML
 */
function getNoStatsRow(idPrefix) {
  let statNoInfoRow = `<tr><td colspan="${
    Object.keys(STAT_HEADERS).length
  }" headers="`

  for (const statHeader in STAT_HEADERS) {
    statNoInfoRow += `${idPrefix}-${statHeader} `
  }
  // Se elimina el espacio final
  statNoInfoRow = statNoInfoRow.slice(0, -1)

  statNoInfoRow += '">No hay información disponible</td></tr>'

  return statNoInfoRow
}

/**
 * Función que devuelve las opciones de configuración y el tablero de juego
 * @returns Código HTML
 */
function getGameConfigAndBoardContent() {
  return `<section class="flex config-board">${getGameConfigContent()}${getGameBoardContent()}</section>`
}

/**
 * Función que devuelve las opciones de configuración del juego
 * @returns Código HTML
 */
function getGameConfigContent() {
  return `<div class="flex config"><h2 class="oculto">Configuración del juego</h2><form class="flex" action="#" method="post" onsubmit="javascript:return false">
  <fieldset class="flex"><legend>Selecciona la dificultad:</legend><div class="flex">${getRadioButtonInputGroup(
    DIFFICULTIES,
    DIFF_ID
  )}</div></fieldset><fieldset class="flex" id="submit"><legend class="oculto">${NEW_GAME_LABEL}</legend>${getSubmitButton(
    NEW_GAME_LABEL
  )}</fieldset></form></div>`
}

// Función que crea los eventos de la zona de juego
function addMainTagListeners() {
  addGameStatEventListeners()
  addGameBoardEventListeners()
  addGameConfigEventListeners()
}

// Función que crea los eventos de las estadísticas del juego
function addGameStatEventListeners() {
  // Ver estadísticas y volver al juego
  document
    .querySelectorAll(`#${STAT_LABELS.view.id}, #${STAT_LABELS.back.id}`)
    .forEach((elem) => {
      elem.addEventListener('click', function () {
        // Se actualiza el contenido de las tablas de las estadísticas del juego en el caso de que el local storage sea eliminado manualmente
        if (elem.id === STAT_LABELS.view.id) {
          printStats()
        }

        document
          .querySelectorAll(
            `#${STAT_LABELS.view.id}, #${STAT_LABELS.back.id}, #${STAT_LABELS.del.id}, .game > section`
          )
          .forEach((elem) => {
            elem.classList.toggle('oculto')
          })
      })
    })

  // Eliminar estadísticas del juego
  document
    .getElementById(STAT_LABELS.del.id)
    .addEventListener('click', function () {
      showConfirmDialog(
        '¿Deseas eliminar las estadísticas almacenadas de las partidas?',
        doStatDeleteActions
      )
    })
}

// Función que realiza las acciones tras confirmar la eliminación de las estadísticas almacenadas de las partidas
function doStatDeleteActions() {
  deleteStats()
  printStats()
}

// Función que crea los eventos del tablero de juego
function addGameBoardEventListeners() {
  document.querySelectorAll('.flip-card-back').forEach((card) => {
    card.addEventListener('click', function () {
      if (!isStartedGame) {
        showAlertDialog('Inicia una nueva partida')
      } else if (!isFullCardPair()) {
        // Se descubre la carta y se almacena formando parte de la pareja de cartas descubiertas
        const flippedCard = board[card.parentElement.id]

        card.classList.toggle('oculto')
        card.previousElementSibling.classList.toggle('oculto')
        card.parentElement.title = flippedCard.card.title

        cardPair.push(flippedCard)

        // Cuando se descubre una pareja de cartas se comprueba y si todas las parejas han sido descubiertas
        if (isFullCardPair()) {
          // Hay tiempo de espera para comprobar la pareja de cartas descubiertas cuando no son iguales
          checkPair(!isSameCardInCardPair())

          if (getFlippedCards().length === board.length) {
            endGame()
          }
        }
      }
    })
  })
}

// Función que crea los eventos de la configuración del juego
function addGameConfigEventListeners() {
  // Nueva partida
  document
    .querySelector('.btn[type="submit"]')
    .addEventListener('click', function () {
      if (isStartedGame) {
        showConfirmDialog(
          'Ya has iniciado una partida. ¿Deseas reiniciar el juego? No se guardará la información sobre la partida en curso',
          resetGame
        )
      } else {
        initGameSettings()
        setTimeCounter()
      }
    })

  // Dificultad del juego
  document.querySelectorAll(`input[name="${DIFF_ID}"]`).forEach((elem) => {
    elem.addEventListener('click', function () {
      if (!isStartedGame) {
        gameDifficulty = elem.value

        createBoard()
        printBoard(DIFFICULTIES[gameDifficulty].className)
        addClassNameToDialog(DIFFICULTIES[gameDifficulty].className)
        // Se vuelven a añadir los eventos del tablero de juego ya que éste se ha regenerado
        addGameBoardEventListeners()
      }
    })
  })
}

/* Estadísticas del juego */

// Función que rellena el contenido de las tablas de las estadísticas del juego
function printStats() {
  for (const difficulty in DIFFICULTIES) {
    const localStorageStats = getStatsByProperty(DIFF_ID, difficulty)
    const tbody = document.querySelector(`#${DIFF_ID}-${difficulty} tbody`)

    // Mejor tiempo obtenido en cada dificultad del juego
    let bestTime = Math.max

    if (localStorageStats === null || localStorageStats.length === 0) {
      tbody.innerHTML = getNoStatsRow(difficulty[0])
    } else {
      const timeDivider = IS_TENTHS ? 100 : 1000

      bestTime = getMin(localStorageStats.map((stat) => stat.time))

      tbody.innerHTML = ''

      // Se listan las estadísticas del juego en orden descendente de fecha
      for (const stat of localStorageStats.reverse()) {
        // Se marcan con un color diferente las filas que registran el mejor tiempo obtenido en cada dificultad del juego
        tbody.innerHTML += `<tr${
          Math.floor(stat.time / timeDivider) ===
          Math.floor(bestTime / timeDivider)
            ? ' class="highlighted"'
            : ''
        }><td headers="${STAT_HEADERS.date.id}">${stat.date}</td><td headers="${
          STAT_HEADERS.time.id
        }">${getFormattedTime(stat.time)}</td></tr>`
      }
    }

    document.querySelector(
      `#${DIFF_ID}-${difficulty} caption > span`
    ).innerHTML = `Mejor tiempo: ${
      bestTime != Math.max
        ? getFormattedTime(bestTime)
        : IS_HOURS
        ? '--:--:--'
        : '--:--'
    }`
  }
}

/* Juego */

// Función que crea la estructura que almacena el tablero de juego
function createBoard() {
  // Se barajan las cartas
  CARDS.sort(() => Math.random() - 0.5)

  // Se juega sólo con las cartas en función de la dificultad del juego seleccionada
  let auxCards = CARDS.slice(
    0,
    (DIFFICULTIES[gameDifficulty].rows * DIFFICULTIES[gameDifficulty].columns) /
      2
  )
  // Se duplican las cartas para poder tener las parejas de las mismas
  auxCards = auxCards.concat(auxCards)

  // Se limpia el tablero de juego
  resetCardPair()
  resetBoard()

  // Se rellena el tablero de juego con cartas aleatorias (depués de barajarlas)
  auxCards.forEach((card, index) => {
    const auxBoardCard = Object.create(boardCard)

    auxBoardCard.pos = index
    auxBoardCard.card = card
    auxBoardCard.flipped = false

    board.push(auxBoardCard)
  })

  // Se vuelven a barajar las cartas para que las parejas no sean secuenciales
  board.sort(() => Math.random() - 0.5)

  // Se reasignan las posiciones de las cartas en el tablero de juego para que sean secuenciales
  board.forEach((card, index) => {
    card.pos = index
  })
}

// Función que inicia una nueva partida
function initGameSettings() {
  document.getElementById('submit').childNodes.forEach((child) => {
    child.innerHTML = 'Reiniciar juego'
  })

  isStartedGame = true
}

/**
 * Función que comprueba si las cartas de la pareja descubierta son iguales
 * @param {Boolean} isDelay Indica si hay tiempo de espera para comprobar la pareja de cartas descubiertas
 */
function checkPair(isDelay) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const checkPairAsync = async () => {
    // Tiempo de espera (milisegundos) para comprobar la pareja de cartas descubiertas
    if (isDelay) {
      await delay(500)
    }

    for (const card of cardPair) {
      const elem = document.getElementById(`${card.pos}`)

      elem.childNodes.forEach((child) => {
        // Si las cartas de la pareja son iguales se dejan descubiertas y se marcan como tal
        // Si las cartas de la pareja no son iguales se vuelven a ocultar
        if (isSameCardInCardPair()) {
          board[card.pos].flipped = true
        } else {
          child.classList.toggle('oculto')
          child.parentElement.title = CARD_REVERSE.title
        }
      })
    }

    // En cualquier caso, se vuelve a reiniciar la pareja de cartas descubiertas
    resetCardPair()
  }

  checkPairAsync()
}

// Función que finaliza una partida
function endGame() {
  clearInterval(interval)

  gameTime.end = new Date().getTime()

  const millisecs = gameTime.end - gameTime.start

  // El tiempo mostrado en el mensaje del juego tiene que ser el mismo que el tiempo mostrado en el mensaje emergente de alerta
  printMessage(getFormattedTime(millisecs))
  showAlertDialogWithActions(
    `Has descubierto todas las parejas. Tu tiempo ha sido de ${getFormattedTime(
      millisecs
    )}`,
    resetGame
  )
  saveStats(gameDifficulty, millisecs)
  printStats()
}

// Función que reinicia el juego
function resetGame() {
  isStartedGame = false

  // Reinicio de la configuración del juego
  gameDifficulty = document.querySelector(
    `input[name="${DIFF_ID}"]:checked`
  ).value

  document.getElementById('submit').childNodes.forEach((child) => {
    child.innerHTML = NEW_GAME_LABEL
  })

  // Reinicio del tablero de juego
  boardCard.flipped = boardCard.card = boardCard.pos = null

  // resetCardPair()
  // resetBoard()
  createBoard()
  printBoard(DIFFICULTIES[gameDifficulty].className)
  addClassNameToDialog(DIFFICULTIES[gameDifficulty].className)
  // Se vuelven a añadir los eventos del tablero de juego ya que éste se ha regenerado
  addGameBoardEventListeners()

  // Reinicio de los mensajes del juego
  clearInterval(interval)
  printMessage(NOT_STARTED_GAME_MSG)
}

/* Util functions */

// Función que establece un contador de tiempo
function setTimeCounter() {
  // printMessage(getFormattedTime(0))

  gameTime.start = new Date().getTime()

  // Contador de tiempo con décimas de segundo
  interval = setInterval(function () {
    printMessage(getFormattedTime(new Date().getTime() - gameTime.start))
  }, 100)
}

/**
 * Función que devuelve un momento determinado de tiempo en formato hh:mm:ss.t
 * @param {Number} millisecs Número de milisegundos que representa un momento determinado de tiempo
 * @returns Tiempo formateado
 */
function getFormattedTime(millisecs) {
  const hours = Math.floor(
    (millisecs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
    .toString()
    .padStart(2, '0')
  const minutes = Math.floor((millisecs % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, '0')
  const seconds = Math.floor((millisecs % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0')
  const tenths = Math.floor((millisecs % 1000) / 100)
    .toString()
    .padStart(1, '0')

  const hoursFormat = IS_HOURS ? `${hours}:` : ''
  const tenthsFormat = IS_TENTHS ? `.${tenths}` : ''

  return `${hoursFormat}${minutes}:${seconds}${tenthsFormat}`
}

/**
 * Función que devuelve el menor elemento de un array de números
 * @param {Number[]} array Array de números
 * @returns Menor número
 */
function getMin(array) {
  return array.sort((elem1, elem2) => elem1 - elem2)[0]
}

/* Mensajes emergentes de SweetAlert2 */

/**
 * Función que añade una clase para controlar la posición de los mensajes emergentes en función de la dificultad / tamaño del tablero de juego
 * @param {String} className Clase que se añade en función de la dificultad / tamaño del tablero de juego
 */
function addClassNameToDialog(className) {
  const bodyClassList = document.getElementsByTagName('body')[0].classList

  for (const difficulty in DIFFICULTIES) {
    bodyClassList.remove(DIFFICULTIES[difficulty].className)
  }

  bodyClassList.add(className)
}

/**
 * Función que muestra un mensaje emergente de alerta
 * @param {String} dialogTitle Texto del mensaje emergente de alerta
 */
function showAlertDialog(dialogTitle) {
  Swal.fire({ title: dialogTitle, confirmButtonText: DIALOG_LABELS.accept })
}

/**
 * Función que muestra un mensaje emergente de alerta y realiza acciones después
 * @param {String} dialogTitle Texto del mensaje emergente de alerta
 * @param {Function} doActions Función con las acciones a realizar
 */
function showAlertDialogWithActions(dialogTitle, doActions) {
  Swal.fire({
    title: dialogTitle,
    confirmButtonText: DIALOG_LABELS.accept
  }).then((result) => {
    if (result.isConfirmed || result.isDismissed) {
      doActions()
    }
  })
}

/**
 * Función que muestra un mensaje emergente de confirmación
 * @param {String} dialogTitle Texto del mensaje emergente de confirmación
 * @param {Function} doActions Función con las acciones a realizar
 */
function showConfirmDialog(dialogTitle, doActions) {
  Swal.fire({
    title: dialogTitle,
    confirmButtonText: DIALOG_LABELS.accept,
    showCancelButton: true,
    cancelButtonText: DIALOG_LABELS.cancel
  }).then((result) => {
    if (result.isConfirmed) {
      doActions()
    }
  })
}
