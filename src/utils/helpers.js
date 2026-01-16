// Utilitários gerais
// Funções auxiliares usadas em todo o projeto

export function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

export function formatDate(date) {
  return new Date(date).toLocaleString('pt-BR')
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input.trim().replace(/[<>]/g, '')
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
