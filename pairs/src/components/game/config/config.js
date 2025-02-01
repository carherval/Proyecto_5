import './config.css'

/**
 * Función que devuelve un grupo relacionado de inputs de tipo radio button
 * @param {Object} dataObject Objeto para generar el grupo de inputs
 * @param {String} dataObject.id Identificador
 * @param {String} dataObject.title Título
 * @param {String} groupName Nombre del grupo
 * @returns Código HTML
 */
export function getRadioButtonInputGroup(dataObject, groupName) {
  let radioButtonInputGroup = ''

  for (const data in dataObject) {
    radioButtonInputGroup += getRadioButtonInput(
      data,
      groupName,
      dataObject[data].title
    )
  }

  return radioButtonInputGroup
}

/**
 * Función que devuelve un input de tipo radio button cuyo label es un texto
 * @param {String} id Identificador y valor del input
 * @param {String} name Nombre del input
 * @param {String} labelText Texto del label del input
 * @returns Código HTML
 */
function getRadioButtonInput(id, name, labelText) {
  return `<input class="rd-btn" type="radio" id="${id}" name="${name}" value="${id}" /><label class="flex" for="${id}">${labelText}</label>`
}

/**
 * Función que devuelve un botón de tipo submit
 * @param {String} labelButton Etiqueta del botón
 * @returns Código HTML
 */
export function getSubmitButton(labelButton) {
  return `<button class="flex btn" type="submit">${labelButton}</button>`
}
