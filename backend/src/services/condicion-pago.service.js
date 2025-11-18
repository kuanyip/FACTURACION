const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');

const selectBase = `
  SELECT id_condicion_pago AS id, codigo, nombre, descripcion
  FROM condicion_pago
`;

const obtenerPorId = async (id) => {
  const [rows] = await pool.execute(`${selectBase} WHERE id_condicion_pago = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const asegurar = (entidad, mensaje) => {
  if (!entidad) throw createHttpError(404, mensaje);
  return entidad;
};

const buscarTodas = async () => {
  const [rows] = await pool.query(`${selectBase} ORDER BY id_condicion_pago DESC`);
  return rows;
};

const crearCondicionPago = async ({ codigo, nombre, descripcion }) => {
  const [result] = await pool.execute(
    'INSERT INTO condicion_pago (codigo, nombre, descripcion) VALUES (?, ?, ?)',
    [codigo, nombre, descripcion ?? null]
  );
  return asegurar(await obtenerPorId(result.insertId), 'No se pudo crear la condicion de pago');
};

const actualizarCondicionPago = async (id, data) => {
  const columnas = { codigo: 'codigo', nombre: 'nombre', descripcion: 'descripcion' };
  const sets = [];
  const values = [];

  for (const [key, col] of Object.entries(columnas)) {
    if (data[key] !== undefined) {
      sets.push(`${col} = ?`);
      values.push(data[key]);
    }
  }

  if (!sets.length) throw createHttpError(400, 'No hay datos para actualizar');

  values.push(id);
  const [result] = await pool.execute(
    `UPDATE condicion_pago SET ${sets.join(', ')} WHERE id_condicion_pago = ?`,
    values
  );
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Condicion de pago no encontrada');
  }

  return asegurar(await obtenerPorId(id), 'Condicion de pago no encontrada');
};

const eliminarCondicionPago = async (id) => {
  const [result] = await pool.execute('DELETE FROM condicion_pago WHERE id_condicion_pago = ?', [id]);
  if (result.affectedRows === 0) throw createHttpError(404, 'Condicion de pago no encontrada');
};

module.exports = {
  buscarTodas,
  crearCondicionPago,
  actualizarCondicionPago,
  eliminarCondicionPago
};
