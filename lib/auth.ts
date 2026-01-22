import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

/**
 * Initialize the PIN if it doesn't exist
 * Default PIN: 1234 (should be changed after first login)
 */
export async function initializePin() {
  const settings = await prisma.appSettings.findFirst()
  if (!settings) {
    const defaultPin = '1234'
    const pinHash = await bcrypt.hash(defaultPin, 10)
    await prisma.appSettings.create({
      data: {
        pinHash,
      },
    })
  }
}

/**
 * Verify the PIN
 */
export async function verifyPin(pin: string): Promise<boolean> {
  const settings = await prisma.appSettings.findFirst()
  if (!settings) {
    await initializePin()
    // After initialization, check again
    const newSettings = await prisma.appSettings.findFirst()
    if (!newSettings) return false
    return await bcrypt.compare(pin, newSettings.pinHash)
  }

  return await bcrypt.compare(pin, settings.pinHash)
}

/**
 * Update the PIN
 */
export async function updatePin(oldPin: string, newPin: string): Promise<boolean> {
  const isValid = await verifyPin(oldPin)
  if (!isValid) return false

  const pinHash = await bcrypt.hash(newPin, 10)
  const settings = await prisma.appSettings.findFirst()

  if (!settings) return false

  await prisma.appSettings.update({
    where: { id: settings.id },
    data: { pinHash },
  })

  return true
}
