const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');

const clienteSelect = `
  SELECT
    id_cliente AS id,
    rut,
    razon_social AS razonSocial,
    giro,
    direccion,
    comuna,
    ciudad,
    telefono,
    email
  FROM cliente
`;

const obtenerClientePorId = async (id) => {
  const [rows] = await pool.execute(`${clienteSelect} WHERE id_cliente = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const asegurarEncontrado = (entidad, mensaje = 'Recurso no encontrado') => {
  if (!entidad) {
    throw createHttpError(404, mensaje);
  }
  return entidad;
};

const normalizarOpcional = (valor) => (valor === undefined ? null : valor);

const buscarTodos = async () => {
  const [rows] = await pool.query(`${clienteSelect} ORDER BY id_cliente DESC`);
  return rows;
};

const crearCliente = async ({ rut, razonSocial, giro, direccion, comuna, ciudad, telefono, email }) => {
  const [result] = await pool.execute(
    `INSERT INTO cliente (rut, razon_social, giro, direccion, comuna, ciudad, telefono, email)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      rut,
      razonSocial,
      normalizarOpcional(giro),
      normalizarOpcional(direccion),
      normalizarOpcional(comuna),
      normalizarOpcional(ciudad),
      normalizarOpcional(telefono),
      normalizarOpcional(email)
    ]
  );
  return asegurarEncontrado(await obtenerClientePorId(result.insertId), 'No se pudo crear el cliente');
};

const actualizarCliente = async (id, data) => {
  const columnas = {
    rut: 'rut',
    razonSocial: 'razon_social',
    giro: 'giro',
    direccion: 'direccion',
    comuna: 'comuna',
    ciudad: 'ciudad',
    telefono: 'telefono',
    email: 'email'
  };

  const sets = [];
  const values = [];
  for (const [key, columna] of Object.entries(columnas)) {
    if (data[key] !== undefined) {
      sets.push(`${columna} = ?`);
      values.push(data[key]);
    }
  }

  if (!sets.length) {
    throw createHttpError(400, 'No hay datos para actualizar');
  }

  values.push(id);
  const [result] = await pool.execute(`UPDATE cliente SET ${sets.join(', ')} WHERE id_cliente = ?`, values);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Cliente no encontrado');
  }
  return asegurarEncontrado(await obtenerClientePorId(id), 'Cliente no encontrado');
};

const eliminarCliente = async (id) => {
  const [result] = await pool.execute('DELETE FROM cliente WHERE id_cliente = ?', [id]);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Cliente no encontrado');
  }
};

module.exports = {
  buscarTodos,
  crearCliente,
  actualizarCliente,
  eliminarCliente
};
