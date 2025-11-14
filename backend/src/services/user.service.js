const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');
const { hashPassword, comparePassword } = require('../utils/password');

const getUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

const getUserById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

const createUser = async ({ name, email, password, role = 'admin' }) => {
  const hashed = await hashPassword(password);
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashed, role]
  );
  return getUserById(result.insertId);
};

const verifyCredentials = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw createHttpError(401, 'Credenciales invalidas');
  }
  const match = await comparePassword(password, user.password);
  if (!match) {
    throw createHttpError(401, 'Credenciales invalidas');
  }
  return user;
};

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn('[auth] ADMIN_EMAIL o ADMIN_PASSWORD no definidos, omitiendo seed');
    return;
  }
  const existing = await getUserByEmail(email);
  if (existing) {
    return;
  }
  const name = process.env.ADMIN_NAME || 'Administrador';
  await createUser({ name, email, password, role: 'admin' });
  console.log(`[auth] Usuario administrador ${email} creado`);
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  verifyCredentials,
  ensureAdminUser
};
