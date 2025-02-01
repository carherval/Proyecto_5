import './footer.css'

/**
 * Función que crea el pie
 * @param {Number} footerHeight Altura del pie
 */
export function createFooterTag(footerHeight) {
  const footer = document.querySelector('footer')

  footer.classList.add('flex', 'footer')
  footer.style = `height: ${footerHeight}rem;`
  footer.innerHTML =
    '<p>&#169; Diseñado y creado por <span class="negrita">Carlos Hernández</span></p>'
}
