const asyncHandler = require('../utils/asyncHandler');
const facturaService = require('../services/factura.service');

module.exports = {
  listar: asyncHandler(async (req, res) => {
    const facturas = await facturaService.buscarTodas();
    res.json({ data: facturas });
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
