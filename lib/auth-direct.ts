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

export async function verifyPinDirect(pin: string): Promise<boolean> {
  const db = getDb()

  try {
    const row = db.prepare('SELECT pinHash FROM AppSettings LIMIT 1').get() as { pinHash: string } | undefined

    if (!row) {
      // No settings found - initialize with default PIN
      const defaultPin = '1234'
      const pinHash = await bcrypt.hash(defaultPin, 10)
      const id = crypto.randomUUID()
      const now = new Date().toISOString()

      db.prepare('INSERT INTO AppSettings (id, pinHash, createdAt, updatedAt) VALUES (?, ?, ?, ?)')
        .run(id, pinHash, now, now)

      // Check against default
      return await bcrypt.compare(pin, pinHash)
    }

    return await bcrypt.compare(pin, row.pinHash)
  } finally {
    db.close()
  }
}
