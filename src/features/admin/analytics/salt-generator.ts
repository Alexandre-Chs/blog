let currentSalt: string | null = null
let previousSalt: string | null = null
let start = false

function generateRandomSalt() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

function initializeSaltsRotation() {
  if (start) return

  currentSalt = generateRandomSalt()
  previousSalt = currentSalt

  setInterval(() => {
    previousSalt = currentSalt!
    currentSalt = generateRandomSalt()
  }, 90 * 1000) // Rotate every 90 secondes

  start = true
}

export function getCurrentSalts() {
  if (!start) initializeSaltsRotation()

  return {
    currentSalt: currentSalt!,
    previousSalt: previousSalt!,
  }
}
