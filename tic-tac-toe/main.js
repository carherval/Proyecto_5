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
  board,
  playerToken,
  getGameBoardContent,
  getBoardBorderLines,
  getBoardCorners,
  getBoardCross,
  getBoardCenter,
  getRandomCell,
  getOppositeCell,
  getFirstAdjacentCell,
  isFullDiagonal,
  getEmptyLineCenterCell,
  printBoard,
  resetBoard,
  getWinnerPlayer,
  getWinnerCell
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

const GAME_TITLE = '3 en raya'
const NEW_GAME_LABEL = 'Nueva partida'
const NOT_STARTED_GAME_MSG = 'Partida no iniciada'

// Cabeceras de las tablas de las estadísticas del juego
const STAT_HEADERS = {
  date: { id: 'date', title: 'Fecha' },
  diff: { id: 'diff', title: 'Dificultad' },
  token: { id: 'token', title: 'Ficha' },
  turn: { id: 'turn', title: 'Inicio de turno' }
}

// Dificultades del juego
const DIFFICULTIES = {
  easy: { id: 'easy', title: 'Fácil' },
  medium: { id: 'medium', title: 'Media' },
  hard: { id: 'hard', title: 'Difícil' }
}

// Fichas del juego
const TOKENS = {
  cross: { id: 'cross', title: 'Ficha cruz' },
  nought: { id: 'nought', title: 'Ficha cero' }
}

// Estructura Sí / No
const YES_NO = {
  yes: { id: 'yes', title: 'Sí' },
  no: { id: 'no', title: 'No' }
}

// Resultados del juego
const GAME_RESULTS = {
  win: { id: 'win', title: 'Partidas ganadas' },
  draw: { id: 'draw', title: 'Partidas empatadas' },
  loss: { id: 'loss', title: 'Partidas perdidas' }
}

// Etiquetas para los mensajes emergentes
const DIALOG_LABELS = {
  accept: 'Aceptar',
  cancel: 'Cancelar'
}

// Configuración del juego (excepto la ficha seleccionada por el jugador humano)
const gameSettings = { difficulty: null, initialTurn: null }

// Indicador de partida iniciada
let startedGame = false
// Indicador del turno del jugador humano
let humTurn = false
// Contador de turnos
let turnCounter = 0

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
  main.innerHTML =
    getGameStatContent() +
    getGameBoardAndConfigContent() +
    getGameMessageContent()

  addMainTagListeners()
  printStats()
  printMessage(NOT_STARTED_GAME_MSG)
}

/**
 * Función que devuelve el contenido de las estadísticas del juego
 * @returns Código HTML
 */
function getGameStatContent() {
  return getStatButtonBoxContent() + getStatTableContent()
}

/**
 * Función que devuelve el contenido de la botonera de las estadísticas
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

  for (const gameResult in GAME_RESULTS) {
    statTables += `<article class="flex" id="${gameResult}"><table summary="Estadísticas almacenadas para las ${GAME_RESULTS[
      gameResult
    ].title.toLowerCase()}"><caption><h2>${
      GAME_RESULTS[gameResult].title
    }</h2></caption><thead>${getStatHeaderRow(
      gameResult[0]
    )}</thead><tbody>${getNoStatsRow(gameResult[0])}</tbody></table></article>`
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
 * Función que devuelve el tablero y las opciones de configuración del juego
 * @returns Código HTML
 */
function getGameBoardAndConfigContent() {
  return `<section class="flex board-config">${getGameBoardContent()}${getGameConfigContent()}</section>`
}

/**
 * Función que devuelve las opciones de configuración del juego
 * @returns Código HTML
 */
function getGameConfigContent() {
  return `<div class="flex config"><h2 class="oculto">Configuración del juego</h2><form class="flex" action="#" method="post" onsubmit="javascript:return false">
  <fieldset class="flex"><legend>Selecciona la dificultad:</legend><div class="flex">${getRadioButtonInputGroup(
    DIFFICULTIES,
    STAT_HEADERS.diff.id,
    false
  )}</div></fieldset><fieldset class="flex"><legend>Selecciona la ficha:</legend><div class="flex">${getRadioButtonInputGroup(
    TOKENS,
    STAT_HEADERS.token.id,
    true
  )}</div></fieldset><fieldset class="flex"><legend>¿Quieres iniciar el juego?:</legend><div class="flex">${getRadioButtonInputGroup(
    YES_NO,
    STAT_HEADERS.turn.id,
    true
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
        document
          .querySelectorAll(
            `#${STAT_LABELS.view.id}, #${STAT_LABELS.back.id}, #${STAT_LABELS.del.id}, .game > section`
          )
          .forEach((elem) => {
            elem.classList.toggle('oculto')
          })
      })
    })

  // Eliminar estadísticas
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
  // Celda seleccionada por el jugador humano
  document.querySelectorAll('.grid > div').forEach((cell) => {
    cell.addEventListener('click', function () {
      const humCell = Number(
        cell.classList[cell.classList.length - 1].replace('c', '')
      )

      if (!startedGame) {
        showAlertDialog('Inicia una nueva partida')
      } else if (humTurn && board[humCell].token === null) {
        board[humCell].token = playerToken.hum
        printBoard(TOKENS)

        // El contador de turnos sólo es necesario para la dificultad difícil
        if (gameSettings.difficulty === DIFFICULTIES.hard.id) {
          turnCounter++
        }

        // Para dar tiempo a pintar el tablero de juego antes de mostrar el mensaje emergente de alerta en el caso de que finalice la partida
        setTimeout(() => checkWinnerPlayer(), 0)
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
      if (startedGame) {
        showConfirmDialog(
          'Ya has iniciado una partida. ¿Deseas reiniciar el juego? No se guardará la información sobre la partida en curso',
          resetGame
        )
      } else {
        if (isInitializedGameSettings() && !humTurn) {
          playComTurn()
        }
      }
    })
}

/* Estadísticas del juego */

// Función que rellena el contenido de las tablas de las estadísticas del juego
function printStats() {
  for (const gameResult in GAME_RESULTS) {
    const localStorageStats = getStatsByProperty('result', gameResult)
    const tbody = document.querySelector(`#${gameResult} tbody`)

    if (localStorageStats === null || localStorageStats.length === 0) {
      tbody.innerHTML = getNoStatsRow(gameResult[0])
    } else {
      tbody.innerHTML = ''

      // Se listan las estadísticas en orden descendente de fecha
      for (const stat of localStorageStats.reverse()) {
        tbody.innerHTML += `<tr><td headers="${STAT_HEADERS.date.id}">${
          stat.date
        }</td><td headers="${STAT_HEADERS.diff.id}">${
          DIFFICULTIES[stat.diff].title
        }</td><td headers="${STAT_HEADERS.token.id}">${getImgTag(
          TOKENS[stat.token]
        )}</td><td headers="${STAT_HEADERS.turn.id}">${getImgTag(
          stat.init ? YES_NO.yes : YES_NO.no
        )}</td></tr>`
      }
    }
  }
}

/* Juego */

/**
 * Función que inicia una nueva partida tras validar la configuración del juego
 * @returns Booleano
 */
function isInitializedGameSettings() {
  const diff = document.querySelector(
    `input[name="${STAT_HEADERS.diff.id}"]:checked`
  )
  const token = document.querySelector(
    `input[name="${STAT_HEADERS.token.id}"]:checked`
  )
  const turn = document.querySelector(
    `input[name="${STAT_HEADERS.turn.id}"]:checked`
  )

  if (diff === null || token === null || turn === null) {
    showAlertDialog(
      'Configura todas las opciones del juego antes de empezar una nueva partida'
    )

    return false
  }

  gameSettings.difficulty = diff.value
  playerToken.hum = token.value
  playerToken.com =
    playerToken.hum === TOKENS.cross.id ? TOKENS.nought.id : TOKENS.cross.id
  humTurn = gameSettings.initialTurn =
    turn.value === YES_NO.yes.id ? true : false

  document.getElementById('submit').childNodes.forEach((child) => {
    child.innerHTML = 'Reiniciar juego'
  })

  printTurn()

  startedGame = true

  return true
}

// Función que muestra a quién corresponde el turno en los mensajes del juego
function printTurn() {
  printMessage(
    humTurn
      ? `Tu turno ( juegas con ${getImgTag(TOKENS[playerToken.hum])} )`
      : `Turno del oponente ( juega con ${getImgTag(TOKENS[playerToken.com])} )`
  )
}

// Función que cambia el turno de cada jugador durante una partida
function changeTurn() {
  humTurn = !humTurn
  printTurn()

  if (!humTurn) {
    playComTurn()
  }
}

// Función que juega un turno del jugador máquina
function playComTurn() {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const playComTurnAsync = async () => {
    // Tiempo de espera (milisegundos) para la respuesta del jugador máquina
    await delay(500)
    board[getComCell()].token = playerToken.com
    printBoard(TOKENS)

    // El contador de turnos sólo es necesario para la dificultad difícil
    if (gameSettings.difficulty === DIFFICULTIES.hard.id) {
      turnCounter++
    }

    // Para dar tiempo a pintar el tablero de juego antes de mostrar el mensaje emergente de alerta en el caso de que finalice la partida
    setTimeout(() => checkWinnerPlayer(), 0)
  }

  playComTurnAsync()
}

/**
 * Función que devuelve la celda del jugador máquina
 * @returns Celda del jugador máquina
 */
function getComCell() {
  const winnerCell = getWinnerCell()

  switch (gameSettings.difficulty) {
    // En dificultad fácil, la celda es aleatoria
    case DIFFICULTIES.easy.id:
      return getRandomCell(board)
    // En dificultad media, la celda es aleatoria pero tiene en cuenta si existe celda ganadora
    case DIFFICULTIES.medium.id:
      return winnerCell !== null ? winnerCell : getRandomCell(board)
    // En dificultad difícil, la celda es la mejor jugada posible
    case DIFFICULTIES.hard.id:
      return winnerCell !== null ? winnerCell : getBestCell()
  }
}

/**
 * Función que devuelve la mejor celda posible del jugador máquina
 * @returns Mejor celda posible del jugador máquina
 */
function getBestCell() {
  switch (turnCounter) {
    // Turno inicial: jugador máquina
    // Primer movimiento del jugador máquina
    case 0:
      return getRandomCell(getBoardCorners())
    // Turno inicial: jugador humano
    // Primer movimiento del jugador máquina
    case 1:
      // El primer movimiento del jugador humano ha sido la celda central
      if (getBoardCenter().token !== null) {
        return getRandomCell(getBoardCorners())
      } else {
        // El primer movimiento del jugador humano ha sido una esquina del tablero
        if (
          getBoardCorners().filter((cell) => cell.token === playerToken.hum)
            .length !== 0
        ) {
          return getBoardCenter().cell
          // El primer movimiento del jugador humano ha sido una celda de la cruz central del tablero (excepto la celda central)
          // El jugador máquina mueve a la primera celda adyacente de esa línea
        } else {
          return getBoardBorderLines().filter(
            (line) => line[1].token === playerToken.hum
          )[0][0].cell
        }
      }
    // Turno inicial: jugador máquina
    // Segundo movimiento del jugador máquina
    case 2:
      return getBoardCenter().token === null
        ? getOppositeCell(playerToken.com)
        : getFirstAdjacentCell(playerToken.com)
    // Turno inicial: jugador humano
    // Segundo movimiento del jugador máquina
    case 3:
      if (isFullDiagonal()) {
        return getBoardCenter().token === playerToken.hum
          ? getOppositeCell(playerToken.com)
          : getRandomCell(getBoardCross())
      } else {
        try {
          return getBoardCenter().token === null
            ? getOppositeCell(playerToken.com)
            : getEmptyLineCenterCell()
        } catch (error) {
          return getBoardCenter().token === null
            ? getBoardCenter().cell
            : getRandomCell(board)
        }
      }
    // Turno inicial: jugador máquina
    // Tercer movimiento del jugador máquina
    case 4:
      return getOppositeCell(playerToken.com)
    // Resto de movimientos
    default:
      try {
        return getBoardCenter().token === null
          ? getOppositeCell(playerToken.com)
          : getRandomCell(board)
      } catch (error) {
        return getBoardCenter().cell
      }
  }
}

// Función que comprueba si hay jugador ganador
function checkWinnerPlayer() {
  const winnerPlayer = getWinnerPlayer()

  winnerPlayer !== null ? endGame(winnerPlayer) : changeTurn()
}

/**
 * Función que finaliza una partida
 * @param {*} winnerPlayer Ficha del jugador ganador
 */
function endGame(winnerPlayer) {
  showAlertDialogWithActions(
    winnerPlayer === playerToken.hum
      ? 'Has ganado'
      : winnerPlayer === playerToken.com
      ? 'Has perdido'
      : 'Partida empatada',
    resetGame
  )
  saveStats(
    gameSettings.difficulty,
    playerToken.hum,
    gameSettings.initialTurn,
    winnerPlayer === playerToken.hum
      ? GAME_RESULTS.win.id
      : winnerPlayer === playerToken.com
      ? GAME_RESULTS.loss.id
      : GAME_RESULTS.draw.id
  )
  printStats()
}

// Función que reinicia el juego
function resetGame() {
  startedGame = false
  // humTurn = false
  turnCounter = 0

  // Reinicio del tablero de juego
  resetBoard()
  printBoard(TOKENS)

  // Reinicio de la configuración del juego
  document.querySelector(
    `input[name="${STAT_HEADERS.diff.id}"]:checked`
  ).checked = false
  document.querySelector(
    `input[name="${STAT_HEADERS.token.id}"]:checked`
  ).checked = false
  document.querySelector(
    `input[name="${STAT_HEADERS.turn.id}"]:checked`
  ).checked = false

  gameSettings.initialTurn = gameSettings.difficulty = null
  playerToken.com = playerToken.hum = null

  document.getElementById('submit').childNodes.forEach((child) => {
    child.innerHTML = NEW_GAME_LABEL
  })

  // Reinicio de los mensajes del juego
  printMessage(NOT_STARTED_GAME_MSG)
}

/* Util functions */

/**
 * Función que devuelve la etiqueta HTML de una imagen
 * @param {Object} image Objeto para generar la imagen
 * @param {String} image.id Nombre del fichero PNG
 * @param {String} image.title Texto alternativo de la imagen
 * @returns Código HTML
 */
function getImgTag(image) {
  return `<img src="assets/images/${image.id}.png" alt="${image.title}" title="${image.title}" />`
}

/* Mensajes emergentes de SweetAlert2 */

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
