const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');

const estadoSelect = `
  SELECT
    id_estado_factura AS id,
    codigo,
    codigo_sii AS codigoSii,
    nombre,
    descripcion,
    es_final AS esFinal
  FROM estado_factura
`;

const obtenerPorId = async (id) => {
  const [rows] = await pool.execute(`${estadoSelect} WHERE id_estado_factura = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const asegurar = (entidad, mensaje) => {
  if (!entidad) {
    throw createHttpError(404, mensaje);
  }
  return entidad;
};

const buscarTodos = async () => {
  const [rows] = await pool.query(`${estadoSelect} ORDER BY id_estado_factura ASC`);
  return rows;
};

const crearEstado = async ({ codigo, codigoSii, nombre, descripcion, esFinal }) => {
  const [result] = await pool.execute(
    'INSERT INTO estado_factura (codigo, codigo_sii, nombre, descripcion, es_final) VALUES (?, ?, ?, ?, ?)',
    [codigo, codigoSii ?? null, nombre, descripcion ?? null, esFinal ? 1 : 0]
  );
  return asegurar(await obtenerPorId(result.insertId), 'No se pudo crear el estado de factura');
};

const actualizarEstado = async (id, data) => {
  const columnas = {
    codigo: 'codigo',
    codigoSii: 'codigo_sii',
    nombre: 'nombre',
    descripcion: 'descripcion',
    esFinal: 'es_final'
  };
  const sets = [];
  const values = [];

  for (const [key, col] of Object.entries(columnas)) {
    if (data[key] !== undefined) {
      sets.push(`${col} = ?`);
      if (key === 'esFinal') {
        values.push(data[key] ? 1 : 0);
      } else {
        values.push(data[key]);
      }
    }
  }

  if (!sets.length) {
    throw createHttpError(400, 'No hay datos para actualizar');
  }

  values.push(id);
  const [result] = await pool.execute(`UPDATE estado_factura SET ${sets.join(', ')} WHERE id_estado_factura = ?`, values);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Estado de factura no encontrado');
  }

  return asegurar(await obtenerPorId(id), 'Estado de factura no encontrado');
};

const eliminarEstado = async (id) => {
  const [result] = await pool.execute('DELETE FROM estado_factura WHERE id_estado_factura = ?', [id]);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Estado de factura no encontrado');
  }
};

module.exports = {
  buscarTodos,
  crearEstado,
  actualizarEstado,
  eliminarEstado
};
