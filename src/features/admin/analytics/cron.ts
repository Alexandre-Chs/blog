import { initializeSaltsRotation } from './salt-generator'
import { saveInactiveSessions } from './session-manager'

let start = false

export function cronAnalytics() {
  if (start) return
  start = true

  saveInactiveSessions()
  initializeSaltsRotation()
}
