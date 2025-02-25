import './board.css'

// Tablero de juego
// Cada celda almacena la posición en el tablero y la ficha
export const board = [
  { cell: 0, token: null },
  { cell: 1, token: null },
  { cell: 2, token: null },
  { cell: 3, token: null },
  { cell: 4, token: null },
  { cell: 5, token: null },
  { cell: 6, token: null },
  { cell: 7, token: null },
  { cell: 8, token: null }
]

// Ficha de cada jugador
export const playerToken = {
  hum: null,
  com: null
}

/**
 * Función que devuelve el tablero de juego
 * @returns Código HTML
 */
export function getGameBoardContent() {
  let gameBoard =
    '<div class="board"><h2 class="oculto">Tablero</h2><div class="grid">'

  for (const cell of board) {
    gameBoard += `<div class="flex c${cell.cell}"></div>`
  }

  gameBoard += '</div></div>'

  return gameBoard
}

/**
 * Función que devuelve todas las líneas del tablero
 * @returns Todas las líneas horizontales, verticales y diagonales
 */
function getBoardLines() {
  return [
    [board[0], board[1], board[2]],
    [board[3], board[4], board[5]],
    [board[6], board[7], board[8]],
    [board[0], board[3], board[6]],
    [board[1], board[4], board[7]],
    [board[2], board[5], board[8]],
    [board[0], board[4], board[8]],
    [board[2], board[4], board[6]]
  ]
}

/**
 * Función que devuelve las líneas de los bordes del tablero (todas excepto la cruz central y las diagonales)
 * @returns Líneas horizontales y verticales exteriores
 */
export function getBoardBorderLines() {
  return [
    [board[0], board[1], board[2]],
    [board[6], board[7], board[8]],
    [board[0], board[3], board[6]],
    [board[2], board[5], board[8]]
  ]
}

/**
 * Función que devuelve las líneas diagonales del tablero
 * @returns Líneas diagonales
 */
function getBoardDiagonalLines() {
  return [
    [board[0], board[4], board[8]],
    [board[2], board[4], board[6]]
  ]
}

/**
 * Función que devuelve las esquinas del tablero
 * @returns Celdas de las esquinas
 */
export function getBoardCorners() {
  return [board[0], board[2], board[6], board[8]]
}

/**
 * Función que devuelve la cruz central del tablero (excepto la celda central)
 * @returns Cruz central (línea horizontal y vertical central) excepto la celda central
 */
export function getBoardCross() {
  return [board[1], board[3], board[5], board[7]]
}

/**
 * Función que devuelve la celda central del tablero
 * @returns Celda central
 */
export function getBoardCenter() {
  return board[4]
}

/**
 * Función que devuelve una celda libre aleatoria del tablero
 * @param {Object} board Subconjunto del tablero
 * @param {Number} board.cell Posición de la celda en el tablero
 * @param {*} board.token Ficha de la celda
 * @returns Celda libre aleatoria
 */
export function getRandomCell(board) {
  const freeCells = board.filter((cell) => cell.token === null)

  return freeCells[Math.floor(Math.random() * freeCells.length)].cell
}

/**
 * Función que devuelve la celda opuesta de la ficha de un jugador en la primera línea de los bordes del tablero que cumpla que sólo tenga dicha ficha y no esté en el centro de la línea
 * @param {*} playerToken Ficha del jugador
 * @returns Celda opuesta
 */
export function getOppositeCell(playerToken) {
  const board = getBoardBorderLines().filter(
    (line) =>
      line.filter((cell) => cell.token === playerToken).length === 1 &&
      line.filter((cell) => cell.token !== playerToken && cell.token !== null)
        .length === 0 &&
      (line[0].token === playerToken || line[2].token === playerToken)
  )

  return board[0][0].token === playerToken ? board[0][2].cell : board[0][0].cell
}

/**
 * Función que devuelve la primera celda adyacente de la ficha de un jugador en la primera línea de los bordes del tablero que cumpla que sólo tenga dicha ficha
 * @param {*} playerToken Ficha del jugador
 * @returns Primera celda adyacente
 */
export function getFirstAdjacentCell(playerToken) {
  const board = getBoardBorderLines().filter(
    (line) =>
      line.filter((cell) => cell.token === playerToken).length === 1 &&
      line.filter((cell) => cell.token !== playerToken && cell.token !== null)
        .length === 0
  )

  return board[0][1].token === null ? board[0][1].cell : board[0][0].cell
}

/**
 * Función que devuelve si existe alguna línea diagonal del tablero completa
 * @returns Booleano
 */
export function isFullDiagonal() {
  return (
    getBoardDiagonalLines().filter(
      (line) => line.filter((cell) => cell.token === null).length === 0
    ).length > 0
  )
}

/**
 * Función que devuelve la celda central de la primera línea de los bordes del tablero que esté vacía
 * @returns Celda central de línea vacía
 */
export function getEmptyLineCenterCell() {
  return getBoardBorderLines().filter(
    (line) => line.filter((cell) => cell.token !== null).length === 0
  )[0][1].cell
}

/**
 * Función que pinta el tablero de juego
 * @param {Object} tokens Objeto para generar las fichas
 * @param {String} tokens.id Identificador de la ficha
 * @param {String} tokens.title Título de la ficha
 */
export function printBoard(tokens) {
  for (let index = 0; index <= board.length - 1; index++) {
    document.querySelector(`.c${index}`).innerHTML =
      board[index].token !== null
        ? `<img class="${
            board[index].token === playerToken.hum ? 'hum' : 'com'
          }" src="/assets/images/${tokens[board[index].token].id}.png" alt="${
            tokens[board[index].token].title
          }" title="${tokens[board[index].token].title}" />`
        : ''
  }
}

// Función que reinicia el tablero de juego
export function resetBoard() {
  for (const cell of board) {
    cell.token = null
  }
}

/**
 * Función que devuelve el jugador ganador
 * @returns Ficha del jugador ganador, partida empatada o nulo en caso contrario
 */
export function getWinnerPlayer() {
  for (const line of getBoardLines()) {
    if (
      line[0].token !== null &&
      line.filter((cell) => cell.token === line[0].token).length === line.length
    ) {
      return line[0].token
    }
  }

  // Si no existe jugador ganador, devuelve el resultado de partida empatada si el tablero ya está completo o nulo en caso contrario
  return board.filter((cell) => cell.token === null).length === 0
    ? 'draw'
    : null
}

/**
 * Función que devuelve la celda ganadora
 * @returns Celda ganadora
 */
export function getWinnerCell() {
  // Tiene prioridad si el jugador máquina puede ganar la partida
  const winnerComCell = getWinnerPlayerCell(playerToken.com)
  const winnerHumCell = getWinnerPlayerCell(playerToken.hum)

  return winnerComCell !== null ? winnerComCell : winnerHumCell
}

/**
 * Función que devuelve la celda ganadora de un jugador
 * @param {*} token Ficha del jugador a evaluar
 * @returns Celda ganadora del jugador o nulo en caso contrario
 */
function getWinnerPlayerCell(token) {
  for (const line of getBoardLines()) {
    const notFreeCells = line.filter(
      (cell) => cell.token !== null && cell.token === token
    )
    const freeCells = line.filter((cell) => cell.token === null)

    // La línea tiene que estar completa de las fichas del jugador a evaluar menos una celda libre
    if (notFreeCells.length === line.length - 1 && freeCells.length === 1) {
      return freeCells[0].cell
    }
  }

  return null
}
