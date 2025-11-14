const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');

const customerSelect =
  'SELECT id, name, email, tax_id AS taxId, phone, address, created_at AS createdAt FROM customers';

const getCustomerById = async (id) => {
  const [rows] = await pool.execute(`${customerSelect} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const ensureFound = (entity, message = 'Recurso no encontrado') => {
  if (!entity) {
    throw createHttpError(404, message);
  }
  return entity;
};

const normalizeOptional = (value) => (value === undefined ? null : value);

const findAll = async () => {
  const [rows] = await pool.query(`${customerSelect} ORDER BY created_at DESC`);
  return rows;
};

const createCustomer = async ({ name, email, taxId, phone, address }) => {
  const [result] = await pool.execute(
    'INSERT INTO customers (name, email, tax_id, phone, address) VALUES (?, ?, ?, ?, ?)',
    [name, email, taxId, normalizeOptional(phone), normalizeOptional(address)]
  );
  return ensureFound(await getCustomerById(result.insertId), 'No se pudo crear el cliente');
};

const updateCustomer = async (id, data) => {
  const columns = {
    name: 'name',
    email: 'email',
    taxId: 'tax_id',
    phone: 'phone',
    address: 'address'
  };

  const sets = [];
  const values = [];
  for (const [key, column] of Object.entries(columns)) {
    if (data[key] !== undefined) {
      sets.push(`${column} = ?`);
      values.push(data[key]);
    }
  }

  if (!sets.length) {
    throw createHttpError(400, 'No hay datos para actualizar');
  }

  values.push(id);
  const [result] = await pool.execute(`UPDATE customers SET ${sets.join(', ')} WHERE id = ?`, values);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Cliente no encontrado');
  }
  return ensureFound(await getCustomerById(id), 'Cliente no encontrado');
};

const deleteCustomer = async (id) => {
  const [result] = await pool.execute('DELETE FROM customers WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Cliente no encontrado');
  }
};

module.exports = {
  findAll,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
