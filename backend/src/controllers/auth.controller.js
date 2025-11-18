const asyncHandler = require('../utils/asyncHandler');
const createHttpError = require('../utils/httpError');
const { generateToken } = require('../utils/token');
const usuarioService = require('../services/usuario.service');

const exponerUsuario = (usuario) => ({
  id: usuario.id,
  name: usuario.name,
  email: usuario.email,
  role: usuario.role,
  createdAt: usuario.created_at
});

module.exports = {
  register: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const existing = await usuarioService.getUserByEmail(body.email);
    if (existing) {
      throw createHttpError(409, 'El correo ya esta registrado');
    }
    const usuario = await usuarioService.createUser(body);
    const token = generateToken({ id: usuario.id, email: usuario.email, role: usuario.role });
    res.status(201).json({ usuario: exponerUsuario(usuario), token });
  }),

  login: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const usuario = await usuarioService.verifyCredentials(body.email, body.password);
    const token = generateToken({ id: usuario.id, email: usuario.email, role: usuario.role });
    res.json({ usuario: exponerUsuario(usuario), token });
  }),

  me: asyncHandler(async (req, res) => {
    const usuario = await usuarioService.getUserById(req.usuario.id);
    if (!usuario) {
      throw createHttpError(404, 'Usuario no encontrado');
    }
    res.json({ usuario: exponerUsuario(usuario) });
  })
};
