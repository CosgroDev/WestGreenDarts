/**
 * Direct Database Authentication (Prisma Workaround)
 * Uses better-sqlite3 directly until Prisma client can be generated
 */

import bcrypt from 'bcryptjs'
import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'prisma', 'dev.db')

function getDb() {
  return new Database(dbPath)
}

/**
 * Initialize the PIN if it doesn't exist
 * Default PIN: 1234 (should be changed after first login)
 */
export async function initializePinDirect(): Promise<void> {
  const db = getDb()

  try {
    const row = db.prepare('SELECT id FROM AppSettings LIMIT 1').get()

    if (!row) {
      const defaultPin = '1234'
      const pinHash = await bcrypt.hash(defaultPin, 10)
      const id = crypto.randomUUID()
      const now = new Date().toISOString()

      db.prepare('INSERT INTO AppSettings (id, pinHash, createdAt, updatedAt) VALUES (?, ?, ?, ?)')
        .run(id, pinHash, now, now)
    }
  } finally {
    db.close()
  }
}

/**
 * Verify the PIN
 */
export async function verifyPinDirect(pin: string): Promise<boolean> {
  const db = getDb()

  try {
    const row = db.prepare('SELECT pinHash FROM AppSettings LIMIT 1').get() as { pinHash: string } | undefined

    if (!row) {
      // No settings found - initialize with default PIN
      await initializePinDirect()
      // After initialization, check again
      const newRow = db.prepare('SELECT pinHash FROM AppSettings LIMIT 1').get() as { pinHash: string } | undefined
      if (!newRow) return false
      return await bcrypt.compare(pin, newRow.pinHash)
    }

    return await bcrypt.compare(pin, row.pinHash)
  } finally {
    db.close()
  }
}

/**
 * Update the PIN
 */
export async function updatePinDirect(oldPin: string, newPin: string): Promise<boolean> {
  const isValid = await verifyPinDirect(oldPin)
  if (!isValid) return false

  const db = getDb()

  try {
    const row = db.prepare('SELECT id FROM AppSettings LIMIT 1').get() as { id: string } | undefined

    if (!row) return false

    const pinHash = await bcrypt.hash(newPin, 10)
    const now = new Date().toISOString()

    db.prepare('UPDATE AppSettings SET pinHash = ?, updatedAt = ? WHERE id = ?')
      .run(pinHash, now, row.id)

    return true
  } finally {
    db.close()
  }
}
