const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');

const formaSelect = `
  SELECT id_forma_pago AS id, codigo, nombre, descripcion
  FROM forma_pago
`;

const obtenerPorId = async (id) => {
  const [rows] = await pool.execute(`${formaSelect} WHERE id_forma_pago = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const asegurar = (entidad, mensaje) => {
  if (!entidad) {
    throw createHttpError(404, mensaje);
  }
  return entidad;
};

const buscarTodos = async () => {
  const [rows] = await pool.query(`${formaSelect} ORDER BY id_forma_pago DESC`);
  return rows;
};

const crearFormaPago = async ({ codigo, nombre, descripcion }) => {
  const [result] = await pool.execute(
    'INSERT INTO forma_pago (codigo, nombre, descripcion) VALUES (?, ?, ?)',
    [codigo, nombre, descripcion ?? null]
  );
  return asegurar(await obtenerPorId(result.insertId), 'No se pudo crear la forma de pago');
};

const actualizarFormaPago = async (id, data) => {
  const columnas = { codigo: 'codigo', nombre: 'nombre', descripcion: 'descripcion' };
  const sets = [];
  const values = [];

  for (const [key, col] of Object.entries(columnas)) {
    if (data[key] !== undefined) {
      sets.push(`${col} = ?`);
      values.push(data[key]);
    }
  }

  if (!sets.length) {
    throw createHttpError(400, 'No hay datos para actualizar');
  }

  values.push(id);
  const [result] = await pool.execute(`UPDATE forma_pago SET ${sets.join(', ')} WHERE id_forma_pago = ?`, values);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Forma de pago no encontrada');
  }

  return asegurar(await obtenerPorId(id), 'Forma de pago no encontrada');
};

const eliminarFormaPago = async (id) => {
  const [result] = await pool.execute('DELETE FROM forma_pago WHERE id_forma_pago = ?', [id]);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Forma de pago no encontrada');
  }
};

module.exports = {
  buscarTodos,
  crearFormaPago,
  actualizarFormaPago,
  eliminarFormaPago
};
