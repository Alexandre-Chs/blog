let currentSalt: string | null = null
let previousSalt: string | null = null

function generateRandomSalt() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function initializeSaltsRotation() {
  currentSalt = generateRandomSalt()
  previousSalt = currentSalt

  setInterval(() => {
    previousSalt = currentSalt!
    currentSalt = generateRandomSalt()
  }, 90 * 1000) // Rotate every 90 secondes
}

export function getCurrentSalts() {
  return {
    currentSalt: currentSalt,
    previousSalt: previousSalt,
  }
}
