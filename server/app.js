const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const env = require('./config/environment');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Security headers (relaxed CSP for production serving React)
app.use(helmet({
  contentSecurityPolicy: env.nodeEnv === 'production' ? false : undefined
}));

// CORS
app.use(cors({
  origin: env.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Cookie parsing
app.use(cookieParser());

// Request logging (sanitized — no PHI)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    }, 'request');
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// API routes
app.use('/api', routes);

// Serve React frontend in production
if (env.nodeEnv === 'production') {
  const clientBuild = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuild, 'index.html'));
  });
} else {
  // 404 handler (dev only — in prod, React handles routing)
  app.use((req, res) => {
    res.status(404).json({ success: false, errorCode: 'ROUTE_NOT_FOUND' });
  });
}

// Centralized error handler
app.use(errorHandler);

module.exports = app;
