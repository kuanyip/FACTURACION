const asyncHandler = require('../utils/asyncHandler');
const createHttpError = require('../utils/httpError');
const facturaService = require('../services/factura.service');

module.exports = {
  listar: asyncHandler(async (req, res) => {
    const facturas = await facturaService.buscarTodas();
    res.json({ data: facturas });
  }),

  listarPorEstado: asyncHandler(async (req, res) => {
    const { estadoId } = req.validated.params;
    const facturas = await facturaService.buscarPorEstado(estadoId);
    res.json({ data: facturas });
  }),

  obtener: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    const factura = await facturaService.buscarPorId(params.id);
    if (!factura) {
      throw createHttpError(404, 'Factura no encontrada');
    }
    res.json({ data: factura });
  }),

  crear: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const factura = await facturaService.crearFactura(body);
    res.status(201).json({ data: factura });
  }),

  actualizar: asyncHandler(async (req, res) => {
    const { params, body } = req.validated;
    const factura = await facturaService.actualizarFactura(params.id, body);
    res.json({ data: factura });
  }),

  eliminar: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    await facturaService.eliminarFactura(params.id);
    res.status(204).send();
  })
};
