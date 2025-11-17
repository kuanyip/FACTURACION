const asyncHandler = require('../utils/asyncHandler');
const formaPagoService = require('../services/forma-pago.service');

module.exports = {
  listar: asyncHandler(async (req, res) => {
    const formas = await formaPagoService.buscarTodos();
    res.json({ data: formas });
  }),

  crear: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const forma = await formaPagoService.crearFormaPago(body);
    res.status(201).json({ data: forma });
  }),

  actualizar: asyncHandler(async (req, res) => {
    const { params, body } = req.validated;
    const forma = await formaPagoService.actualizarFormaPago(params.id, body);
    res.json({ data: forma });
  }),

  eliminar: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    await formaPagoService.eliminarFormaPago(params.id);
    res.status(204).send();
  })
};
