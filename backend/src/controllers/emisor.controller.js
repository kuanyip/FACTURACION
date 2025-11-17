const asyncHandler = require('../utils/asyncHandler');
const emisorService = require('../services/emisor.service');

module.exports = {
  listar: asyncHandler(async (req, res) => {
    const emisores = await emisorService.buscarTodos();
    res.json({ data: emisores });
  }),

  crear: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const emisor = await emisorService.crearEmisor(body);
    res.status(201).json({ data: emisor });
  }),

  actualizar: asyncHandler(async (req, res) => {
    const { params, body } = req.validated;
    const emisor = await emisorService.actualizarEmisor(params.id, body);
    res.json({ data: emisor });
  }),

  eliminar: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    await emisorService.eliminarEmisor(params.id);
    res.status(204).send();
  })
};
