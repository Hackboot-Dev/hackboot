const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password to hash: ', (password) => {
  if (!password) {
    console.log('Error: Password cannot be empty');
    rl.close();
    return;
  }

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('Error generating hash:', err);
    } else {
      console.log('\n✓ Password hash generated successfully!\n');
      console.log('Hash:', hash);
      console.log('\nCopy this hash to data/ads-users.json in the "passwordHash" field');
    }
    rl.close();
  });
});
