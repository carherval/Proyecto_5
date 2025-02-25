import './board.css'

// Colores de los pulsadores del tablero de juego
// Los colores tienen que ser los mismos que los especificados en board.css
export const BOARD_COLORS = {
  green: {
    id: 'green',
    title: 'Verde',
    color: '#5bbf3a',
    activeColor: '#7cfc00'
  },
  red: {
    id: 'red',
    title: 'Rojo',
    color: '#c0392b',
    activeColor: '#ff4500'
  },
  yellow: {
    id: 'yellow',
    title: 'Amarillo',
    color: '#d4ac0d',
    activeColor: '#ffff00'
  },
  blue: {
    id: 'blue',
    title: 'Azul',
    color: '#2e86c1',
    activeColor: '#00bfff'
  }
}

// Secuencia de colores de la partida
export const colorSequence = []

/**
 * Función que devuelve el tablero de juego
 * @returns Código HTML
 */
export function getGameBoardContent() {
  return `<div class="flex board"><h2 class="oculto">Tablero</h2><div class="grid"><div class="${BOARD_COLORS.green.id}" title="${BOARD_COLORS.green.title}"></div><div class="${BOARD_COLORS.red.id}" title="${BOARD_COLORS.red.title}"></div><div class="${BOARD_COLORS.yellow.id}" title="${BOARD_COLORS.yellow.title}"></div><div class="${BOARD_COLORS.blue.id}" title="${BOARD_COLORS.blue.title}"></div></div></div>`
}

// Función que crea la secuencia de colores de la partida
export function createColorSequence(maxSeq) {
  const colors = Object.keys(BOARD_COLORS)

  resetColorSequence()

  for (let index = 0; index < maxSeq; index++) {
    colorSequence.push(colors[Math.floor(Math.random() * colors.length)])
  }
}

/**
 * Función que comprueba si el color de un pulsador del tablero de juego coincide con el de la secuencia de colores de la partida en una determinada posición
 * @param {*} color Color del pulsador del tablero de juego
 * @param {Number} pos Posición dentro de la secuencia de colores de la partida
 * @returns Booleano
 */
export function isCorrectColor(color, pos) {
  return color === colorSequence[pos]
}

// Función que reinicia la secuencia de colores de la partida
export function resetColorSequence() {
  colorSequence.length = 0
}
