import './stats.css'

// Etiquetas para la botonera de las estadísticas
export const STAT_LABELS = {
  view: {
    id: 'view',
    label: 'Estadísticas',
    title: 'Ver las estadísticas del juego'
  },
  del: {
    id: 'del',
    label: 'Eliminar',
    title: 'Eliminar las estadísticas del juego'
  },
  back: { id: 'back', label: 'Volver', title: 'Volver al juego' }
}

/**
 * Función que devuelve un enlace en forma de botón para la botonera de las estadísticas
 * @param {String} id Identificador del enlace
 * @param {String} statLabel Etiqueta del enlace
 * @param {String} statTitle Título del enlace
 * @returns Código HTML
 */
export function getButtonLink(id, statLabel, statTitle) {
  return `<a class="flex btn-lnk" id="${id}" href="#" title="${statTitle}">${statLabel}</a>`
}

/**
 * Función que devuelve las estadísticas de las partidas almacenadas en el local storage
 * @param {String} localStorageStatKey Clave de las estadísticas del local storage
 * @returns Estadísticas de las partidas almacenadas en el local storage
 */
function getStats(localStorageStatKey) {
  return JSON.parse(localStorage.getItem(localStorageStatKey))
}

/**
 * Función que devuelve las estadísticas de las partidas almacenadas en el local storage filtradas por un valor de propiedad
 * @param {String} localStorageStatKey Clave de las estadísticas del local storage
 * @param {String} property Propiedad por la que filtrar las estadísticas
 * @param {*} value Valor de property por la que filtrar las estadísticas
 * @returns Filtrado de las estadísticas de las partidas almacenadas en el local storage o nulo si no están almacenadas
 */
export function getStatsByProperty(localStorageStatKey, property, value) {
  const localStorageStats = getStats(localStorageStatKey)

  return localStorageStats !== null
    ? localStorageStats.filter((stat) => stat[property] === value)
    : null
}

/**
 * Función que actualiza las estadísticas de las partidas almacenadas en el local storage
 * @param {String} localStorageStatKey Clave de las estadísticas del local storage
 * @param {Array} localStorageStats Estadísticas a actualizar en el local storage
 */
function setStats(localStorageStatKey, localStorageStats) {
  localStorage.setItem(localStorageStatKey, JSON.stringify(localStorageStats))
}

/**
 * Función que elimina las estadísticas de las partidas almacenadas en el local
 * @param {String} localStorageStatKey Clave de las estadísticas del local storage
 */
export function deleteStats(localStorageStatKey) {
  localStorage.removeItem(localStorageStatKey)
}

/**
 * Función que guarda las estadísticas de una partida finalizada en el local storage
 * @param {String} localStorageStatKey Clave de las estadísticas del local storage
 * @param {Object} stat Objeto con la información de la partida finalizada
 */
export function saveStats(localStorageStatKey, stat) {
  let localStorageStats = getStats(localStorageStatKey)

  if (localStorageStats === null) {
    localStorageStats = []
  }
  localStorageStats.push(stat)

  setStats(localStorageStatKey, localStorageStats)
}

/**
 * Función que devuelve la fecha actual en formato dd/mm/yyyy hh:mm
 * @returns Fecha actual formateada
 */
export function getCurrentDate() {
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
