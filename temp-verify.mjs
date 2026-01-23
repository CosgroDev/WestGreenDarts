import sqlite3 from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new sqlite3('./prisma/dev.db');
const pin = process.argv[2] || '1234';

const row = db.prepare('SELECT pinHash FROM AppSettings LIMIT 1').get();

if (row) {
  const isValid = bcrypt.compareSync(pin, row.pinHash);
  console.log(JSON.stringify({ success: isValid, pin: pin }));
  process.exit(isValid ? 0 : 1);
} else {
  console.log(JSON.stringify({ error: 'No settings found' }));
  process.exit(1);
}
