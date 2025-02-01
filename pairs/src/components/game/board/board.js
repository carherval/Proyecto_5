import './board.css'

export const CARD_REVERSE = 'Reverso de la carta'

// Carta del juego
export const boardCard = { pos: null, card: null, flipped: null }

// Tablero de juego
export const board = []

// Pareja de cartas descubiertas
export const cardPair = []

/**
 * Función que devuelve el tablero de juego
 * @returns Código HTML
 */
export function getGameBoardContent() {
  return '<div class="flex board"><h2 class="oculto">Tablero</h2><div class="flex"></div></div>'
}

/**
 * Función que pinta el tablero de juego
 * @param {String} className Clase que se aplica al tablero de juego en función de su dificultad / tamaño
 */
export function printBoard(className) {
  const boardDiv = document.querySelector('.board > div')

  boardDiv.classList = `flex ${className}`
  boardDiv.innerHTML = ''

  for (const card of board) {
    boardDiv.innerHTML += getCardToPrint(card)
  }
}

/**
 * Función que devuelve una carta para colocarla oculta en el tablero de juego
 * @param {Object} card Objeto para generar la carta
 * @param {Number} card.pos Posición que ocupa la carta en el tablero de juego
 * @param {Object} card.card Objeto para generar la imagen de la carta
 * @param {String} card.card.id Nombre del fichero PNG de la carta
 * @param {String} card.card.title Texto alternativo de la imagen de la carta
 * @param {Boolean} card.flipped Indicador de carta descubierta
 * @returns Código HTML
 */
function getCardToPrint(card) {
  return `<div class="flex flip-card" id="${
    card.pos
  }" title="${CARD_REVERSE}"><div class="flex flip-card-front oculto">${getImgTag(
    card.card
  )}</div><div class="flex flip-card-back">${getImgTag({
    id: 'power',
    title: CARD_REVERSE
  })}</div></div>`
}

/**
 * Función que devuelve si se ha descubierto una pareja de cartas
 * @returns Booleano
 */
export function isFullCardPair() {
  return cardPair.length === 2
}

/**
 * Función que devuelve si las cartas de la pareja descubierta son iguales
 * @returns Booleano
 */
export function isSameCardInCardPair() {
  return cardPair[0].card === cardPair[1].card
}

/**
 * Función que devuelve todas las cartas descubiertas del tablero de juego
 * @returns Subconjunto del tablero de juego
 */
export function getFlippedCards() {
  return board.filter((card) => card.flipped === true)
}

// Función que reinicia el tablero de juego
export function resetBoard() {
  board.length = 0
}

// Función que reinicia la pareja de cartas descubiertas
export function resetCardPair() {
  cardPair.length = 0
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
  return `<img src="assets/images/${image.id}.png" alt="${image.title}" />`
}
