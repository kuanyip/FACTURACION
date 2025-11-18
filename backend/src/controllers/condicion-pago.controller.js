const asyncHandler = require('../utils/asyncHandler');
const condicionPagoService = require('../services/condicion-pago.service');

module.exports = {
  listar: asyncHandler(async (req, res) => {
    const items = await condicionPagoService.buscarTodas();
    res.json({ data: items });
  }),

  crear: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const item = await condicionPagoService.crearCondicionPago(body);
    res.status(201).json({ data: item });
  }),

  actualizar: asyncHandler(async (req, res) => {
    const { params, body } = req.validated;
    const item = await condicionPagoService.actualizarCondicionPago(params.id, body);
    res.json({ data: item });
  }),

  eliminar: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    await condicionPagoService.eliminarCondicionPago(params.id);
    res.status(204).send();
  })
};
