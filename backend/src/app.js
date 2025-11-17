const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/cliente.routes');
const facturaRoutes = require('./routes/factura.routes');
const authMiddleware = require('./middleware/auth');
const { version } = require('../package.json');

const app = express();

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

app.use(limiter);
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'billing-api',
    version
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/clientes', authMiddleware, clienteRoutes);
app.use('/api/facturas', authMiddleware, facturaRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
