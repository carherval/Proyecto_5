import './messages.css'

/**
 * Función que devuelve los mensajes del juego
 * @returns Código HTML
 */
export function getGameMessageContent() {
  return '<section class="flex message"><p class="flex"></p></section>'
}

/**
 * Función que muestra un mensaje del juego
 * @param {String} message Mensaje a mostrar
 */
export function printMessage(message) {
  document.querySelector('.message > p').innerHTML = message
}
