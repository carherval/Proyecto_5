import './style.css'

// Mensajes emergentes de SweetAlert2
import Swal from 'sweetalert2'

const HEADER_HEIGHT = 7.5
const FOOTER_HEIGHT = 7.5

const GAME_TITLE = 'Simon'
const NEW_GAME_LABEL = 'Nueva partida'
const NOT_STARTED_GAME_MSG = 'Partida no iniciada'

// Etiquetas para los mensajes emergentes
const DIALOG_LABELS = {
  accept: 'Aceptar',
  cancel: 'Cancelar'
}

/* Estadísticas del juego */

/* Juego */

/* Util functions */

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
