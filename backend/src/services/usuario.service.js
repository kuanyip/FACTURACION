const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');
const { hashPassword, comparePassword } = require('../utils/password');

const getUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
  return rows[0] || null;
};

const getUserById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM usuarios WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};

const createUser = async ({ name, email, password, role = 'digitador' }) => {
  const hashed = await hashPassword(password);
  const [result] = await pool.execute(
    'INSERT INTO usuarios (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashed, role]
  );
  return getUserById(result.insertId);
};

const listUsers = async () => {
  const [rows] = await pool.execute('SELECT * FROM usuarios ORDER BY id DESC');
  return rows;
};

const updateUser = async (id, { name, email, password, role }) => {
  const current = await getUserById(id);
  if (!current) {
    throw createHttpError(404, 'Usuario no encontrado');
  }

  const sets = [];
  const values = [];

  if (name !== undefined) {
    sets.push('name = ?');
    values.push(name);
  }
  if (email !== undefined) {
    sets.push('email = ?');
    values.push(email);
  }
  if (role !== undefined) {
    sets.push('role = ?');
    values.push(role);
  }
  if (password !== undefined) {
    const hashed = await hashPassword(password);
    sets.push('password = ?');
    values.push(hashed);
  }

  if (sets.length) {
    values.push(id);
    await pool.execute(`UPDATE usuarios SET ${sets.join(', ')} WHERE id = ?`, values);
  }

  return getUserById(id);
};

const deleteUser = async (id) => {
  const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Usuario no encontrado');
  }
};

const verifyCredentials = async (email, password) => {
  const usuario = await getUserByEmail(email);
  if (!usuario) {
    throw createHttpError(401, 'Credenciales invalidas');
  }
  const match = await comparePassword(password, usuario.password);
  if (!match) {
    throw createHttpError(401, 'Credenciales invalidas');
  }
  return usuario;
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
  listUsers,
  getUserByEmail,
  getUserById,
  updateUser,
  deleteUser,
  verifyCredentials,
  ensureAdminUser
};
