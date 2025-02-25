import './simon.css'

import {
  STAT_LABELS,
  getButtonLink,
  getStatsByProperty,
  deleteStats,
  saveStats,
  getCurrentDate
} from '../../components/game/stats/stats'

import {
  BOARD_COLORS,
  colorSequence,
  getGameBoardContent,
  createColorSequence,
  isCorrectColor,
  resetColorSequence
} from './board/board'

import {
  getRadioButtonInputGroup,
  getSubmitButton
} from '../../components/game/config/config'

import {
  getGameMessageContent,
  printMessage
} from '../../components/game/messages/messages'

// Mensajes emergentes de SweetAlert2
import Swal from 'sweetalert2'

const LOCAL_STORAGE_STAT_KEY = 'simon_stats'
const NEW_GAME_LABEL = 'Nueva partida'
const NOT_STARTED_GAME_MSG = 'Partida no iniciada'
const STARTED_GAME_MSG =
  'Ya has iniciado una partida y no se guardará la información sobre la misma'
const HIT_MESSAGE = 'Número máximo de aciertos'

const DIFF_ID = 'diff'
const ACTIVE_CLASS_PREFIX = 'active-'

const MAX_SEQ = 50

// Cabeceras de las tablas de las estadísticas del juego
const STAT_HEADERS = {
  date: { id: 'date', title: 'Fecha' },
  hits: { id: 'hits', title: 'Aciertos' }
}

// Dificultades del juego
const DIFFICULTIES = {
  easy: { id: 'easy', title: 'Fácil', delay: 1000 },
  medium: { id: 'medium', title: 'Media', delay: 500 },
  hard: { id: 'hard', title: 'Difícil', delay: 250 }
}

// Etiquetas para los mensajes emergentes
const DIALOG_LABELS = {
  accept: 'Aceptar',
  cancel: 'Cancelar'
}

// Dificultad del juego
let gameDifficulty = DIFFICULTIES.medium.id
// Indicador de partida iniciada
let isStartedGame = false
// Indicador de secuencia activa (reproducción)
let isActiveSequence = false
// Contador de la posición de la secuencia de colores de la partida
let colorSequencePos = 0
// Contador de la posición de la secuencia de colores del jugador
let playerSequencePos = 0
// Resultado del juego
let gameHits = 0

/**
 * Función que crea la zona de juego
 * @param {Number} headerHeight Altura de la cabecera
 * @param {Number} footerHeight Altura del pie
 */
export function createMainTag(headerHeight, footerHeight) {
  const main = document.querySelector('main')

  main.classList = []
  main.classList.add('flex', 'game')
  main.style = `height: calc(100vh - ${
    headerHeight + footerHeight
  }rem); overflow-y: auto;`

  main.innerHTML =
    getGameStatContent() +
    getGameConfigAndBoardContent() +
    getGameMessageContent()

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
  return `<nav><ul class="flex"><li>${getButtonLink(
    'menu',
    'Menú',
    'Volver al menú principal'
  )}</li><li>${getButtonLink(
    STAT_LABELS.view.id,
    STAT_LABELS.view.label,
    STAT_LABELS.view.title
  )}</li><li class="oculto">${getButtonLink(
    STAT_LABELS.back.id,
    STAT_LABELS.back.label,
    STAT_LABELS.back.title
  )}</li><li class="oculto">${getButtonLink(
    STAT_LABELS.del.id,
    STAT_LABELS.del.label,
    STAT_LABELS.del.title
  )}</li></ul></nav>`
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
  // Volver al menú principal
  document.querySelector('#menu').addEventListener('click', function () {
    isStartedGame
      ? showConfirmDialog(
          `¿Deseas volver al menú principal?. ${STARTED_GAME_MSG}`,
          backToMenu
        )
      : backToMenu()
  })

  // Ver estadísticas y volver al juego
  document
    .querySelectorAll(`#${STAT_LABELS.view.id}, #${STAT_LABELS.back.id}`)
    .forEach((elem) => {
      elem.addEventListener('click', function () {
        // Se actualiza el contenido de las tablas de las estadísticas del juego en el caso de que el local storage sea modificado de forma concurrente
        if (elem.id === STAT_LABELS.view.id) {
          printStats()
        }

        document
          .querySelectorAll(
            `#${STAT_LABELS.view.id}, #${STAT_LABELS.back.id}, #${STAT_LABELS.del.id}`
          )
          .forEach((elem) => {
            elem.parentElement.classList.toggle('oculto')
          })

        document.querySelectorAll('.game > section').forEach((elem) => {
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

// Función que redirige al menú principal
function backToMenu() {
  window.location.assign('/index.html')
}

// Función que realiza las acciones tras confirmar la eliminación de las estadísticas almacenadas de las partidas
function doStatDeleteActions() {
  deleteStats(LOCAL_STORAGE_STAT_KEY)
  printStats()
}

// Función que crea los eventos del tablero de juego
function addGameBoardEventListeners() {
  document.querySelectorAll('.board > div > div').forEach((color) => {
    color.addEventListener('click', function () {
      if (!isStartedGame) {
        showAlertDialog('Inicia una nueva partida')
      } else if (!isActiveSequence) {
        if (
          !isCorrectColor(
            color.className.replace(ACTIVE_CLASS_PREFIX, ''),
            playerSequencePos
          )
        ) {
          endGame()
        } else {
          // El jugador no ha terminado de repetir la reproducción de la secuencia de colores
          if (playerSequencePos !== colorSequencePos) {
            playerSequencePos++
          } else {
            gameHits++

            // El jugador ha acertado la secuencia de colores completa
            if (playerSequencePos === MAX_SEQ - 1) {
              endGame()
            } else {
              // Se reproduce la secuencia de colores anterior añadiendo un color más
              colorSequencePos++
              playerSequencePos = 0

              playColorSequence(colorSequencePos)
            }
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
          `¿Deseas reiniciar el juego?. ${STARTED_GAME_MSG}`,
          resetGame
        )
      } else {
        initGameSettings()
        playColorSequence(colorSequencePos)
      }
    })
}

/* Estadísticas del juego */

// Función que rellena el contenido de las tablas de las estadísticas del juego
function printStats() {
  for (const difficulty in DIFFICULTIES) {
    const localStorageStats = getStatsByProperty(
      LOCAL_STORAGE_STAT_KEY,
      DIFF_ID,
      difficulty
    )
    const tbody = document.querySelector(`#${DIFF_ID}-${difficulty} tbody`)

    // Número máximo de aciertos obtenidos en cada dificultad del juego
    let maxHits = -1

    if (localStorageStats === null || localStorageStats.length === 0) {
      tbody.innerHTML = getNoStatsRow(difficulty[0])
    } else {
      maxHits = getMax(localStorageStats.map((stat) => stat.hits))

      tbody.innerHTML = ''

      // Se listan las estadísticas del juego en orden descendente de fecha
      for (const stat of localStorageStats.reverse()) {
        // Se marcan con un color diferente las filas que registran el número máximo de aciertos obtenidos en cada dificultad del juego
        tbody.innerHTML += `<tr${
          stat.hits === maxHits ? ' class="highlighted"' : ''
        }><td headers="${STAT_HEADERS.date.id}">${stat.date}</td><td headers="${
          STAT_HEADERS.hits.id
        }">${stat.hits}</td></tr>`
      }
    }

    document.querySelector(
      `#${DIFF_ID}-${difficulty} caption > span`
    ).innerHTML = `${HIT_MESSAGE}: ${maxHits != -1 ? maxHits : '--'}`
  }
}

/* Juego */

// Función que inicia una nueva partida
function initGameSettings() {
  gameDifficulty = document.querySelector(
    `input[name="${DIFF_ID}"]:checked`
  ).value

  document.getElementById('submit').childNodes.forEach((child) => {
    child.innerHTML = 'Reiniciar juego'
  })

  createColorSequence(MAX_SEQ)

  isStartedGame = true
}

/**
 * Función que reproduce la secuencia de colores de la partida hasta la posición actual
 * @param {Number} pos Posición que indica hasta dónde repetir la secuencia de colores de la partida
 */
function playColorSequence(pos) {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const playColorSequenceAsync = async () => {
    try {
      activeSequenceToggle(false)
      printMessage('Reproduciendo secuencia de colores...')

      // Tiempo de espera (milisegundos) para reproducir la secuencia de colores de la partida
      await delay(500)

      for (let index = 0; index <= pos; index++) {
        const color = document.querySelector(`.${colorSequence[index]}`)

        // Tiempo de espera (milisegundos) para activar el siguiente color de la secuencia
        await delay(DIFFICULTIES[gameDifficulty].delay)
        color.style.backgroundColor =
          BOARD_COLORS[colorSequence[index]].activeColor
        // Tiempo de espera (milisegundos) para desactivar el color actual de la secuencia
        await delay(DIFFICULTIES[gameDifficulty].delay)
        color.style.backgroundColor = BOARD_COLORS[colorSequence[index]].color
      }

      // Tiempo de espera (milisegundos) para indicar al jugador que repita la secuencia de colores
      await delay(500)

      printMessage('Repite la secuencia de colores')
      activeSequenceToggle(true)
    } catch (error) {
      console.log(
        'Se ha producido una interrupción durante la reproducción de la secuencia de colores'
      )
      resetGame()
    }
  }

  playColorSequenceAsync()
}

/**
 * Función que alterna entre la reproducción de la secuencia de colores y que el jugador repita dicha secuencia
 * @param {Boolean} isPlayerSequence Indica si el jugador tiene que repetir la secuencia de colores
 */
function activeSequenceToggle(isPlayerSequence) {
  isActiveSequence = !isActiveSequence

  document.querySelectorAll('.board > div > div').forEach((color) => {
    const className = color.className

    // Se eliminan los estilos añadidos durante la reproducción de la secuencia de colores
    color.removeAttribute('style')

    // Si se reproduce la secuencia de colores se desactivan los pulsadores del tablero de juego
    if (!isPlayerSequence) {
      color.className = className.replace(ACTIVE_CLASS_PREFIX, '')
    } else {
      // if (!className.includes(ACTIVE_CLASS_PREFIX)) {
      color.className = `${ACTIVE_CLASS_PREFIX}${className}`
      // }
    }
  })
}

// Función que finaliza una partida
function endGame() {
  const stat = { date: getCurrentDate(), diff: gameDifficulty, hits: gameHits }

  showAlertDialogWithActions(
    `${
      gameHits === MAX_SEQ
        ? '¡Enhorabuena!, has acertado la secuencia de colores completa'
        : 'Has fallado'
    }. ${HIT_MESSAGE}: ${gameHits}`,
    resetGame
  )
  saveStats(LOCAL_STORAGE_STAT_KEY, stat)
  printStats()
}

// Función que reinicia el juego
function resetGame() {
  isActiveSequence = isStartedGame = false

  // Reinicio de la configuración del juego
  gameDifficulty = document.querySelector(
    `input[name="${DIFF_ID}"]:checked`
  ).value

  document.getElementById('submit').childNodes.forEach((child) => {
    child.innerHTML = NEW_GAME_LABEL
  })

  // Reinicio del tablero de juego
  resetColorSequence()

  // Se reinician los pulsadores del tablero de juego
  document.querySelectorAll('.grid > div').forEach((color) => {
    color.className = color.className.replace(ACTIVE_CLASS_PREFIX, '')
    color.removeAttribute('style')
  })

  gameHits = playerSequencePos = colorSequencePos = 0

  // Reinicio de los mensajes del juego
  printMessage(NOT_STARTED_GAME_MSG)
}

/* Util functions */

/**
 * Función que devuelve el mayor elemento de un array de números
 * @param {Number[]} array Array de números
 * @returns Mayor número
 */
function getMax(array) {
  return array.sort((elem1, elem2) => elem2 - elem1)[0]
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
