const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');

const emisorSelect = `
  SELECT
    id_emisor AS id,
    rut,
    razon_social AS razonSocial,
    giro,
    direccion,
    comuna,
    ciudad,
    telefono,
    email,
    sitio_web AS sitioWeb
  FROM emisor
`;

const obtenerPorId = async (id) => {
  const [rows] = await pool.execute(`${emisorSelect} WHERE id_emisor = ? LIMIT 1`, [id]);
  return rows[0] || null;
};

const asegurarEncontrado = (entidad, mensaje = 'Recurso no encontrado') => {
  if (!entidad) {
    throw createHttpError(404, mensaje);
  }
  return entidad;
};

const normalizar = (valor) => (valor === undefined ? null : valor);

const buscarTodos = async () => {
  const [rows] = await pool.query(`${emisorSelect} ORDER BY id_emisor DESC`);
  return rows;
};

const crearEmisor = async ({ rut, razonSocial, giro, direccion, comuna, ciudad, telefono, email, sitioWeb }) => {
  const [result] = await pool.execute(
    `INSERT INTO emisor (rut, razon_social, giro, direccion, comuna, ciudad, telefono, email, sitio_web)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      rut,
      razonSocial,
      normalizar(giro),
      normalizar(direccion),
      normalizar(comuna),
      normalizar(ciudad),
      normalizar(telefono),
      normalizar(email),
      normalizar(sitioWeb)
    ]
  );
  return asegurarEncontrado(await obtenerPorId(result.insertId), 'No se pudo crear el emisor');
};

const actualizarEmisor = async (id, data) => {
  const columnas = {
    rut: 'rut',
    razonSocial: 'razon_social',
    giro: 'giro',
    direccion: 'direccion',
    comuna: 'comuna',
    ciudad: 'ciudad',
    telefono: 'telefono',
    email: 'email',
    sitioWeb: 'sitio_web'
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
  const [result] = await pool.execute(`UPDATE emisor SET ${sets.join(', ')} WHERE id_emisor = ?`, values);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Emisor no encontrado');
  }
  return asegurarEncontrado(await obtenerPorId(id), 'Emisor no encontrado');
};

const eliminarEmisor = async (id) => {
  const [result] = await pool.execute('DELETE FROM emisor WHERE id_emisor = ?', [id]);
  if (result.affectedRows === 0) {
    throw createHttpError(404, 'Emisor no encontrado');
  }
};

module.exports = {
  buscarTodos,
  crearEmisor,
  actualizarEmisor,
  eliminarEmisor
};
