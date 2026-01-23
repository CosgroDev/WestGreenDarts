#!/usr/bin/env node

/**
 * Deployment initialization script
 * Ensures database is ready before starting the application
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting deployment initialization...');

// Ensure prisma directory exists
const prismaDir = path.join(process.cwd(), 'prisma');
if (!fs.existsSync(prismaDir)) {
  console.log('📁 Creating prisma directory...');
  fs.mkdirSync(prismaDir, { recursive: true });
}

// Check if database exists
const dbPath = path.join(prismaDir, 'dev.db');
const dbExists = fs.existsSync(dbPath);

if (!dbExists) {
  console.log('🗄️  Database not found. Initializing...');

  // Run the database schema creation script
  try {
    execSync('node scripts/init-db.ts', { stdio: 'inherit' });
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Database already exists');
}

// Verify database is accessible
try {
  const Database = require('better-sqlite3');
  const db = new Database(dbPath);
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`✅ Database verified: ${tables.length} tables found`);
  db.close();
} catch (error) {
  console.error('❌ Database verification failed:', error.message);
  process.exit(1);
}

console.log('🎉 Deployment initialization complete!');
