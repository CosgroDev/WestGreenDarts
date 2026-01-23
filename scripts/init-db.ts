/**
 * Database Initialization Script
 * Run with: npx tsx scripts/init-db.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Initializing database...')

  // Check if AppSettings exists
  const settings = await prisma.appSettings.findFirst()

  if (!settings) {
    console.log('📌 Creating default PIN (1234)...')
    const defaultPin = '1234'
    const pinHash = await bcrypt.hash(defaultPin, 10)

    await prisma.appSettings.create({
      data: {
        pinHash,
      },
    })

    console.log('✅ Default PIN created successfully!')
    console.log('   PIN: 1234')
    console.log('   (Please change this after first login)')
  } else {
    console.log('ℹ️  AppSettings already exists')
  }

  console.log('✨ Database initialized!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
