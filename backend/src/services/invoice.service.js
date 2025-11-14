const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');

const invoiceSelect = `
  SELECT
    i.id,
    i.customer_id AS customerId,
    c.name AS customerName,
    i.description,
    i.status,
    i.issue_date AS issueDate,
    i.due_date AS dueDate,
    i.total,
    i.created_at AS createdAt
  FROM invoices i
  LEFT JOIN customers c ON c.id = i.customer_id
`;

const getInvoiceById = async (id) => {
  const [rows] = await pool.execute(`${invoiceSelect} WHERE i.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const ensureInvoice = async (id) => {
  const invoice = await getInvoiceById(id);
  if (!invoice) {
    throw createHttpError(404, 'Factura no encontrada');
  }
  return invoice;
};

const ensureCustomerExists = async (customerId) => {
  const [rows] = await pool.execute('SELECT id FROM customers WHERE id = ? LIMIT 1', [customerId]);
  if (!rows[0]) {
    throw createHttpError(404, 'Cliente no encontrado');
  }
};

const findAll = async () => {
  const [rows] = await pool.query(`${invoiceSelect} ORDER BY i.created_at DESC`);
  return rows;
};

const createInvoice = async ({ customerId, description, status = 'draft', issueDate, dueDate, total }) => {
  await ensureCustomerExists(customerId);
  const [result] = await pool.execute(
    'INSERT INTO invoices (customer_id, description, status, issue_date, due_date, total) VALUES (?, ?, ?, ?, ?, ?)',
    [customerId, description, status, issueDate, dueDate, total]
  );
  return ensureInvoice(result.insertId);
};

const updateInvoice = async (id, data) => {
  if (data.customerId !== undefined) {
    await ensureCustomerExists(data.customerId);
  }

  const columns = {
    customerId: 'customer_id',
    description: 'description',
    status: 'status',
    issueDate: 'issue_date',
    dueDate: 'due_date',
    total: 'total'
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
  const [result] = await pool.execute(`UPDATE invoices SET ${sets.join(', ')} WHERE id = ?`, values);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Factura no encontrada');
  }

  return ensureInvoice(id);
};

const deleteInvoice = async (id) => {
  const [result] = await pool.execute('DELETE FROM invoices WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Factura no encontrada');
  }
};

module.exports = {
  findAll,
  createInvoice,
  updateInvoice,
  deleteInvoice
};
