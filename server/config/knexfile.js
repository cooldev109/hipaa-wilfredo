const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      database: process.env.DATABASE_NAME || 'neuronita_evf',
      user: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || ''
    },
    migrations: {
      directory: path.join(__dirname, '..', '..', 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, '..', '..', 'database', 'seeds')
    }
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      directory: path.join(__dirname, '..', '..', 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, '..', '..', 'database', 'seeds')
    }
  }
};
