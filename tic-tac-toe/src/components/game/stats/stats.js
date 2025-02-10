import './stats.css'

const LOCAL_STORAGE_STAT_KEY = 'tic-tac-toe_stats'

// Etiquetas para la botonera de las estadísticas
export const STAT_LABELS = {
  view: { id: 'view', title: 'Ver estadísticas del juego' },
  del: { id: 'del', title: 'Eliminar estadísticas del juego' },
  back: { id: 'back', title: 'Volver al juego' }
}

/**
 * Función que devuelve un enlace en forma de botón para la botonera de las estadísticas
 * @param {String} id Identificador del enlace
 * @param {String} statLabel Etiqueta del enlace
 * @returns Código HTML
 */
export function getButtonLink(id, statLabel) {
  return `<a class="flex btn-lnk" id="${id}" href="#">${statLabel}</a>`
}

/**
 * Función que devuelve un enlace oculto en forma de botón para la botonera de las estadísticas
 * @param {String} id Identificador del enlace
 * @param {String} statLabel Etiqueta del enlace
 * @returns Código HTML
 */
export function getHiddenButtonLink(id, statLabel) {
  return `<a class="flex btn-lnk oculto" id="${id}" href="#">${statLabel}</a>`
}

/**
 * Función que devuelve las estadísticas de las partidas almacenadas en el local storage
 * @returns Estadísticas de las partidas almacenadas en el local storage
 */
function getStats() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_STAT_KEY))
}

/**
 * Función que devuelve las estadísticas de las partidas almacenadas en el local storage filtradas por un valor de propiedad
 * @param {String} property Propiedad por la que filtrar las estadísticas
 * @param {*} value Valor de property por la que filtrar las estadísticas
 * @returns Filtrado de las estadísticas de las partidas almacenadas en el local storage o nulo si no están almacenadas
 */
export function getStatsByProperty(property, value) {
  const localStorageStats = getStats()

  return localStorageStats !== null
    ? localStorageStats.filter((stat) => stat[property] === value)
    : null
}

/**
 * Función que actualiza las estadísticas de las partidas almacenadas en el local storage
 * @param {Array} localStorageStats Estadísticas a actualizar en el local storage
 */
function setStats(localStorageStats) {
  localStorage.setItem(
    LOCAL_STORAGE_STAT_KEY,
    JSON.stringify(localStorageStats)
  )
}

// Función que elimina las estadísticas de las partidas almacenadas en el local storage
export function deleteStats() {
  localStorage.removeItem(LOCAL_STORAGE_STAT_KEY)
}

/**
 * Función que guarda las estadísticas de una partida finalizada en el local storage
 * @param {String} statDiff Dificultad seleccionada por el jugador humano
 * @param {*} statToken Ficha seleccionada por el jugador humano
 * @param {Boolean} statTurn Turno inicial del jugador humano
 * @param {String} gameResult Tipo de resultado de la partida finalizada
 */
export function saveStats(statDiff, statToken, statTurn, gameResult) {
  const stat = {
    date: getCurrentDate(),
    diff: statDiff,
    token: statToken,
    init: statTurn,
    result: gameResult
  }

  let localStorageStats = getStats()

  if (localStorageStats === null) {
    localStorageStats = []
  }
  localStorageStats.push(stat)

  setStats(localStorageStats)
}

/**
 * Función que devuelve la fecha actual en formato dd/mm/yyyy hh:mm
 * @returns Fecha actual formateada
 */
function getCurrentDate() {
  const currentDate = new Date()

  return `${currentDate.getDate().toString().padStart(2, '0')}/${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}/${currentDate.getFullYear()} ${currentDate
    .getHours()
    .toString()
    .padStart(2, '0')}:${currentDate
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`
}
