const { pool } = require('../config/db');
const createHttpError = require('../utils/httpError');

const facturaBaseSelect = `
  SELECT
    f.id_factura AS id,
    f.tipo_dte AS tipoDte,
    f.folio,
    f.fecha_emision AS fechaEmision,
    f.moneda,
    f.id_emisor AS emisorId,
    f.id_cliente AS clienteId,
    f.condicion_pago AS condicionPago,
    f.id_forma_pago AS formaPagoId,
    f.fecha_vencimiento AS fechaVencimiento,
    f.orden_compra AS ordenCompra,
    f.neto_afecto AS netoAfecto,
    f.neto_exento AS netoExento,
    f.otros_cargos AS otrosCargos,
    f.impuesto_especifico AS impuestoEspecifico,
    f.monto_iva AS montoIva,
    f.total,
    f.id_estado_factura AS estadoFacturaId,
    f.fecha_creacion AS fechaCreacion,
    f.fecha_actualizacion AS fechaActualizacion,
    c.razon_social AS clienteRazonSocial,
    c.rut AS clienteRut,
    e.razon_social AS emisorRazonSocial,
    e.rut AS emisorRut,
    ef.codigo AS estadoCodigo,
    ef.nombre AS estadoNombre,
    fp.codigo AS formaPagoCodigo,
    fp.nombre AS formaPagoNombre
  FROM factura f
  LEFT JOIN cliente c ON c.id_cliente = f.id_cliente
  LEFT JOIN emisor e ON e.id_emisor = f.id_emisor
  LEFT JOIN estado_factura ef ON ef.id_estado_factura = f.id_estado_factura
  LEFT JOIN forma_pago fp ON fp.id_forma_pago = f.id_forma_pago
`;

const calcularSubtotal = (detalle) => {
  const cantidad = Number(detalle.cantidad) || 0;
  const precio = Number(detalle.precioUnitario) || 0;
  const base = cantidad * precio;
  const descPorcentaje = Number(detalle.descuentoPorcentaje || 0);
  const descMonto = Number(detalle.descuentoMonto || 0);
  const descuento = descMonto + (descPorcentaje > 0 ? (descPorcentaje / 100) * base : 0);
  const subtotal = base - descuento;
  return subtotal < 0 ? 0 : subtotal;
};

const fetchDetalles = async (conn, facturaId) => {
  const [rows] = await conn.execute(
    `SELECT
        id_detalle AS id,
        id_factura AS facturaId,
        nro_linea AS nroLinea,
        descripcion,
        cantidad,
        precio_unitario AS precioUnitario,
        descuento_porcentaje AS descuentoPorcentaje,
        descuento_monto AS descuentoMonto,
        subtotal
     FROM factura_detalle
     WHERE id_factura = ?
     ORDER BY nro_linea ASC`,
    [facturaId]
  );
  return rows;
};

const fetchImpuestos = async (conn, facturaId) => {
  const [rows] = await conn.execute(
    `SELECT id_impuesto AS id, id_factura AS facturaId, codigo_impuesto AS codigoImpuesto, descripcion, monto
     FROM factura_impuesto
     WHERE id_factura = ?`,
    [facturaId]
  );
  return rows;
};

const fetchReferencias = async (conn, facturaId) => {
  const [rows] = await conn.execute(
    `SELECT
        id_referencia AS id,
        id_factura AS facturaId,
        tipo_doc AS tipoDoc,
        folio_ref AS folioRef,
        fecha_ref AS fechaRef,
        motivo
     FROM factura_referencia
     WHERE id_factura = ?`,
    [facturaId]
  );
  return rows;
};

const ensureExists = async (conn, table, idField, id, message) => {
  const [rows] = await conn.execute(`SELECT ${idField} AS id FROM ${table} WHERE ${idField} = ? LIMIT 1`, [id]);
  if (!rows[0]) {
    throw createHttpError(404, message);
  }
};

const getFacturaById = async (id, includeChildren = false, externalConn = null) => {
  const conn = externalConn || pool;
  const [rows] = await conn.execute(`${facturaBaseSelect} WHERE f.id_factura = ? LIMIT 1`, [id]);
  const factura = rows[0] || null;
  if (!factura) return null;

  if (includeChildren) {
    const [detalles, impuestos, referencias] = await Promise.all([
      fetchDetalles(conn, id),
      fetchImpuestos(conn, id),
      fetchReferencias(conn, id)
    ]);
    factura.detalles = detalles;
    factura.impuestos = impuestos;
    factura.referencias = referencias;
  }

  return factura;
};

const ensureFactura = async (id, conn = pool) => {
  const factura = await getFacturaById(id, true, conn);
  if (!factura) {
    throw createHttpError(404, 'Factura no encontrada');
  }
  return factura;
};

const buscarTodas = async () => {
  const [rows] = await pool.query(`${facturaBaseSelect} ORDER BY f.fecha_creacion DESC`);
  return rows;
};

const insertarDetalles = async (conn, facturaId, detalles = []) => {
  if (!detalles?.length) return;
  const insertSql = `
    INSERT INTO factura_detalle
      (id_factura, nro_linea, descripcion, cantidad, precio_unitario, descuento_porcentaje, descuento_monto, subtotal)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  for (let i = 0; i < detalles.length; i++) {
    const d = detalles[i];
    const subtotal = d.subtotal !== undefined ? Number(d.subtotal) : calcularSubtotal(d);
    await conn.execute(insertSql, [
      facturaId,
      d.nroLinea || i + 1,
      d.descripcion,
      d.cantidad,
      d.precioUnitario,
      d.descuentoPorcentaje ?? 0,
      d.descuentoMonto ?? 0,
      subtotal
    ]);
  }
};

const insertarImpuestos = async (conn, facturaId, impuestos = []) => {
  if (!impuestos?.length) return;
  const insertSql = `
    INSERT INTO factura_impuesto (id_factura, codigo_impuesto, descripcion, monto)
    VALUES (?, ?, ?, ?)
  `;
  for (const imp of impuestos) {
    await conn.execute(insertSql, [facturaId, imp.codigoImpuesto, imp.descripcion ?? null, imp.monto]);
  }
};

const insertarReferencias = async (conn, facturaId, referencias = []) => {
  if (!referencias?.length) return;
  const insertSql = `
    INSERT INTO factura_referencia (id_factura, tipo_doc, folio_ref, fecha_ref, motivo)
    VALUES (?, ?, ?, ?, ?)
  `;
  for (const ref of referencias) {
    await conn.execute(insertSql, [
      facturaId,
      ref.tipoDoc,
      ref.folioRef,
      ref.fechaRef,
      ref.motivo ?? null
    ]);
  }
};

const crearFactura = async (data) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await ensureExists(conn, 'emisor', 'id_emisor', data.emisorId, 'Emisor no encontrado');
    await ensureExists(conn, 'cliente', 'id_cliente', data.clienteId, 'Cliente no encontrado');
    await ensureExists(conn, 'forma_pago', 'id_forma_pago', data.formaPagoId, 'Forma de pago no encontrada');
    await ensureExists(conn, 'estado_factura', 'id_estado_factura', data.estadoFacturaId, 'Estado de factura no encontrado');

    const insertSql = `
      INSERT INTO factura (
        tipo_dte,
        folio,
        fecha_emision,
        moneda,
        id_emisor,
        id_cliente,
        condicion_pago,
        id_forma_pago,
        fecha_vencimiento,
        orden_compra,
        neto_afecto,
        neto_exento,
        otros_cargos,
        impuesto_especifico,
        monto_iva,
        total,
        id_estado_factura,
        user_create,
        user_update
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await conn.execute(insertSql, [
      data.tipoDte,
      data.folio,
      data.fechaEmision,
      data.moneda || 'CLP',
      data.emisorId,
      data.clienteId,
      data.condicionPago || 'CONTADO',
      data.formaPagoId,
      data.fechaVencimiento || null,
      data.ordenCompra || null,
      data.netoAfecto ?? 0,
      data.netoExento ?? 0,
      data.otrosCargos ?? 0,
      data.impuestoEspecifico ?? 0,
      data.montoIva ?? 0,
      data.total,
      data.estadoFacturaId,
      data.userCreate || null,
      data.userUpdate || null
    ]);

    const facturaId = result.insertId;

    await insertarDetalles(conn, facturaId, data.detalles);
    await insertarImpuestos(conn, facturaId, data.impuestos);
    await insertarReferencias(conn, facturaId, data.referencias);

    await conn.commit();
    return ensureFactura(facturaId, conn);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const actualizarFactura = async (id, data) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const existente = await getFacturaById(id, false, conn);
    if (!existente) {
      throw createHttpError(404, 'Factura no encontrada');
    }

    if (data.emisorId !== undefined) {
      await ensureExists(conn, 'emisor', 'id_emisor', data.emisorId, 'Emisor no encontrado');
    }
    if (data.clienteId !== undefined) {
      await ensureExists(conn, 'cliente', 'id_cliente', data.clienteId, 'Cliente no encontrado');
    }
    if (data.formaPagoId !== undefined) {
      await ensureExists(conn, 'forma_pago', 'id_forma_pago', data.formaPagoId, 'Forma de pago no encontrada');
    }
    if (data.estadoFacturaId !== undefined) {
      await ensureExists(conn, 'estado_factura', 'id_estado_factura', data.estadoFacturaId, 'Estado de factura no encontrado');
    }

    const columnas = {
      tipoDte: 'tipo_dte',
      folio: 'folio',
      fechaEmision: 'fecha_emision',
      moneda: 'moneda',
      emisorId: 'id_emisor',
      clienteId: 'id_cliente',
      condicionPago: 'condicion_pago',
      formaPagoId: 'id_forma_pago',
      fechaVencimiento: 'fecha_vencimiento',
      ordenCompra: 'orden_compra',
      netoAfecto: 'neto_afecto',
      netoExento: 'neto_exento',
      otrosCargos: 'otros_cargos',
      impuestoEspecifico: 'impuesto_especifico',
      montoIva: 'monto_iva',
      total: 'total',
      estadoFacturaId: 'id_estado_factura',
      userUpdate: 'user_update'
    };

    const sets = [];
    const values = [];

    for (const [key, columna] of Object.entries(columnas)) {
      if (data[key] !== undefined) {
        sets.push(`${columna} = ?`);
        values.push(data[key]);
      }
    }

    if (sets.length) {
      values.push(id);
      await conn.execute(`UPDATE factura SET ${sets.join(', ')} WHERE id_factura = ?`, values);
    }

    if (data.detalles !== undefined) {
      await conn.execute('DELETE FROM factura_detalle WHERE id_factura = ?', [id]);
      await insertarDetalles(conn, id, data.detalles);
    }

    if (data.impuestos !== undefined) {
      await conn.execute('DELETE FROM factura_impuesto WHERE id_factura = ?', [id]);
      await insertarImpuestos(conn, id, data.impuestos);
    }

    if (data.referencias !== undefined) {
      await conn.execute('DELETE FROM factura_referencia WHERE id_factura = ?', [id]);
      await insertarReferencias(conn, id, data.referencias);
    }

    await conn.commit();
    return ensureFactura(id, conn);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const eliminarFactura = async (id) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const factura = await getFacturaById(id, false, conn);
    if (!factura) {
      throw createHttpError(404, 'Factura no encontrada');
    }
    await conn.execute('DELETE FROM factura_detalle WHERE id_factura = ?', [id]);
    await conn.execute('DELETE FROM factura_impuesto WHERE id_factura = ?', [id]);
    await conn.execute('DELETE FROM factura_referencia WHERE id_factura = ?', [id]);
    const [result] = await conn.execute('DELETE FROM factura WHERE id_factura = ?', [id]);
    if (result.affectedRows === 0) {
      throw createHttpError(404, 'Factura no encontrada');
    }
    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  buscarTodas,
  crearFactura,
  actualizarFactura,
  eliminarFactura,
  ensureFactura
};
