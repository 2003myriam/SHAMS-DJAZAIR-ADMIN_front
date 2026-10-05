// Fonction utilitaire cn() : combine des classes CSS (gère les conditions et les conflits Tailwind).
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
