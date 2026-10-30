import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000'
const origin = process.env.SMOKE_ORIGIN || process.env.BASE_URL || base
const request = (path, options = {}) => fetch(base + path, { redirect: 'manual', signal: AbortSignal.timeout(15000), ...options })
for (const path of ['/', '/api/auth/ok']) {
  assert.equal((await request(path)).status, 200, path)
}
const session = await request('/api/auth/get-session')
assert.equal(session.status, 200)
if (await session.json() !== null) throw new Error('Anonymous request unexpectedly received a session')
const invalidLogin = await request('/api/auth/sign-in/email', {
  method: 'POST',
  headers: { 'content-type': 'application/json', origin },
  body: JSON.stringify({ email: `security-check-${randomUUID()}@example.invalid`, password: 'nonexistent-fixture-account-control' }),
})
assert.equal(invalidLogin.status, 401)
console.log('PASS: homepage, auth health, anonymous session and nonexistent-account denial')
