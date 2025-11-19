const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'billing_user',
  password: process.env.DB_PASSWORD || 'billing_secret',
  database: process.env.DB_NAME || 'facturacion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
});

const ensureTables = async () => {
  // Solo garantizamos la tabla de usuarios para autenticacion del backend.
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(160) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin','revisor','digitador') DEFAULT 'digitador',
      status ENUM('activo','inactivo') NOT NULL DEFAULT 'activo',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);

  // Aseguramos la columna status para instalaciones previas
  try {
    await pool.execute(`
      ALTER TABLE usuarios
      ADD COLUMN status ENUM('activo','inactivo') NOT NULL DEFAULT 'activo' AFTER role
    `);
  } catch (error) {
    if (error.code !== 'ER_DUP_FIELDNAME') {
      throw error;
    }
  }

  console.log('[database] Tabla de usuarios lista (resto de tablas proviene del script facturacion.sql)');
};

module.exports = { pool, ensureTables };
