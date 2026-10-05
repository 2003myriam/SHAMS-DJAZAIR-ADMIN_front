// Fonctions utilitaires pour les cookies.
/**
 * Fonctions pour lire / écrire / supprimer des cookies (avec document.cookie)
 */

const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7 // 7 jours

/**
 * Lit la valeur d'un cookie à partir de son nom
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return undefined

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue
  }
  return undefined
}

/**
 * Crée un cookie (nom, valeur et durée de vie optionnelle)
 */
export function setCookie(name, value, maxAge = DEFAULT_MAX_AGE) {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`
}

/**
 * Supprime un cookie (durée de vie à 0)
 */
export function removeCookie(name) {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=; path=/; max-age=0`
}
