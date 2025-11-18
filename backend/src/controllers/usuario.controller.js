const asyncHandler = require('../utils/asyncHandler');
const createHttpError = require('../utils/httpError');
const usuarioService = require('../services/usuario.service');

const exponerUsuario = (usuario) => ({
  id: usuario.id,
  name: usuario.name,
  email: usuario.email,
  role: usuario.role,
  createdAt: usuario.created_at
});

module.exports = {
  listar: asyncHandler(async (req, res) => {
    const usuarios = await usuarioService.listUsers();
    res.json({ data: usuarios.map(exponerUsuario) });
  }),

  obtener: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    const usuario = await usuarioService.getUserById(params.id);
    if (!usuario) {
      throw createHttpError(404, 'Usuario no encontrado');
    }
    res.json({ data: exponerUsuario(usuario) });
  }),

  crear: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const existing = await usuarioService.getUserByEmail(body.email);
    if (existing) {
      throw createHttpError(409, 'El correo ya esta registrado');
    }
    const usuario = await usuarioService.createUser(body);
    res.status(201).json({ data: exponerUsuario(usuario) });
  }),

  actualizar: asyncHandler(async (req, res) => {
    const { params, body } = req.validated;
    const usuario = await usuarioService.updateUser(params.id, body);
    res.json({ data: exponerUsuario(usuario) });
  }),

  eliminar: asyncHandler(async (req, res) => {
    const { params } = req.validated;
    await usuarioService.deleteUser(params.id);
    res.status(204).send();
  })
};
