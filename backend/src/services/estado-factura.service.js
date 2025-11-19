const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');

const estadoSelectTemplate = (includeCodigoSii) => `
  SELECT
    id_estado_factura AS id,
    codigo,
    ${includeCodigoSii ? 'codigo_sii AS codigoSii,' : 'NULL AS codigoSii,'}
    nombre,
    descripcion,
    es_final AS esFinal
  FROM estado_factura
`;

let soportaCodigoSii = null;

const verificarColumnaCodigoSii = async () => {
  if (soportaCodigoSii !== null) {
    return soportaCodigoSii;
  }
  try {
    const [rows] = await pool.query(
      `SELECT 1
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'estado_factura'
         AND COLUMN_NAME = 'codigo_sii'
       LIMIT 1`
    );
    soportaCodigoSii = rows.length > 0;
  } catch (error) {
    console.warn('[estado-factura] No se pudo verificar la columna codigo_sii. Se asumira que no existe.', error.message);
    soportaCodigoSii = false;
  }
  return soportaCodigoSii;
};

const obtenerEstadoSelect = async () => {
  const incluyeCodigoSii = await verificarColumnaCodigoSii();
  return estadoSelectTemplate(incluyeCodigoSii);
};

const obtenerPorId = async (id) => {
  const select = await obtenerEstadoSelect();
  const [rows] = await pool.execute(`${select} WHERE id_estado_factura = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const asegurar = (entidad, mensaje) => {
  if (!entidad) {
    throw createHttpError(404, mensaje);
  }
  return entidad;
};

const buscarTodos = async () => {
  const select = await obtenerEstadoSelect();
  const [rows] = await pool.query(`${select} ORDER BY id_estado_factura ASC`);
  return rows;
};

const crearEstado = async ({ codigo, codigoSii, nombre, descripcion, esFinal }) => {
  const incluyeCodigoSii = await verificarColumnaCodigoSii();
  const sql = incluyeCodigoSii
    ? 'INSERT INTO estado_factura (codigo, codigo_sii, nombre, descripcion, es_final) VALUES (?, ?, ?, ?, ?)'
    : 'INSERT INTO estado_factura (codigo, nombre, descripcion, es_final) VALUES (?, ?, ?, ?)';
  const valores = incluyeCodigoSii
    ? [codigo, codigoSii ?? null, nombre, descripcion ?? null, esFinal ? 1 : 0]
    : [codigo, nombre, descripcion ?? null, esFinal ? 1 : 0];
  const [result] = await pool.execute(sql, valores);
  return asegurar(await obtenerPorId(result.insertId), 'No se pudo crear el estado de factura');
};

const actualizarEstado = async (id, data) => {
  const incluyeCodigoSii = await verificarColumnaCodigoSii();
  const columnas = {
    codigo: 'codigo',
    nombre: 'nombre',
    descripcion: 'descripcion',
    esFinal: 'es_final'
  };
  if (incluyeCodigoSii) {
    columnas.codigoSii = 'codigo_sii';
  }
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
