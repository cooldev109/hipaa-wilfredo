const app = require('./app');
const env = require('./config/environment');
const { testConnection } = require('./config/database');
const logger = require('./utils/logger');

async function start() {
  const dbConnected = await testConnection();

  if (!dbConnected) {
    logger.error('Cannot start server without database connection');
    process.exit(1);
  }

  app.listen(env.port, () => {
    logger.info({ port: env.port, env: env.nodeEnv }, 'Neuronita EVF server started');
  });
}

start();
