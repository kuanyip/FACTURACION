const asyncHandler = require('../utils/asyncHandler');
const estadoFacturaService = require('../services/estado-factura.service');

module.exports = {
  listar: asyncHandler(async (_req, res) => {
    const estados = await estadoFacturaService.buscarTodos();
    res.json({ data: estados });
  }),

  crear: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const estado = await estadoFacturaService.crearEstado(body);
    res.status(201).json({ data: estado });
  }),

  actualizar: asyncHandler(async (req, res) => {
    const { params, body } = req.validated;
    const estado = await estadoFacturaService.actualizarEstado(params.id, body);
    res.json({ data: estado });
  }),

  eliminar: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    await estadoFacturaService.eliminarEstado(params.id);
    res.status(204).send();
  })
};
