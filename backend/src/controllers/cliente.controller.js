const asyncHandler = require('../utils/asyncHandler');
const clienteService = require('../services/cliente.service');

module.exports = {
  listar: asyncHandler(async (req, res) => {
    const clientes = await clienteService.buscarTodos();
    res.json({ data: clientes });
  }),

  crear: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const cliente = await clienteService.crearCliente(body);
    res.status(201).json({ data: cliente });
  }),

  actualizar: asyncHandler(async (req, res) => {
    const { params, body } = req.validated;
    const actualizado = await clienteService.actualizarCliente(params.id, body);
    res.json({ data: actualizado });
  }),

  eliminar: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    await clienteService.eliminarCliente(params.id);
    res.status(204).send();
  })
};
