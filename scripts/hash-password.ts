import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Please provide a password as an argument. Example: npx tsx scripts/hash-password.ts "mypassword"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('----------------------------------------');
console.log('Password:', password);
console.log('Hash (Paste this in the Neon console!):', hash);
console.log('----------------------------------------');
