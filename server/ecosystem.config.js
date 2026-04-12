module.exports = {
  apps: [
    {
      name: 'neuronita-evf',
      script: 'index.js',
      cwd: '/var/www/neuronita/server',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
