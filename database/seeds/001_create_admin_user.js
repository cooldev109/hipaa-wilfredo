const path = require('path');
const bcrypt = require(path.join(__dirname, '..', '..', 'server', 'node_modules', 'bcrypt'));

exports.seed = async function (knex) {
  const existingAdmin = await knex('users').where({ email: 'admin@neuronita.com' }).first();

  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed.');
    return;
  }

  const passwordHash = await bcrypt.hash('Neuronita2026!', 12);

  await knex('users').insert({
    email: 'admin@neuronita.com',
    password_hash: passwordHash,
    first_name: 'Wilfredo',
    last_name: 'Cruz Martínez',
    role: 'doctor',
    license_number: '440-0139',
    is_active: true,
    force_password_change: true
  });

  console.log('Admin user created: admin@neuronita.com (password must be changed on first login)');
};
