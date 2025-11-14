require('dotenv').config();
const app = require('./app');
const { ensureTables, pool } = require('./config/db');
const { ensureAdminUser } = require('./services/user.service');

const PORT = process.env.PORT || 3800;

const start = async () => {
  try {
    await ensureTables();
    await ensureAdminUser();
    app.listen(PORT, () => {
      console.log(`[server] API escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[server] Error al iniciar la aplicacion', error);
    process.exit(1);
  }
};

start();

const gracefulShutdown = async () => {
  console.log('[server] Cerrando conexiones...');
  try {
    await pool.end();
  } catch (error) {
    console.error('[server] Error al cerrar el pool', error);
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
