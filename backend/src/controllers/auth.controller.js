const asyncHandler = require('../utils/asyncHandler');
const createHttpError = require('../utils/httpError');
const { generateToken } = require('../utils/token');
const userService = require('../services/user.service');

const exposeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.created_at
});

module.exports = {
  register: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const existing = await userService.getUserByEmail(body.email);
    if (existing) {
      throw createHttpError(409, 'El correo ya esta registrado');
    }
    const user = await userService.createUser(body);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.status(201).json({ user: exposeUser(user), token });
  }),

  login: asyncHandler(async (req, res) => {
    const { body } = req.validated;
    const user = await userService.verifyCredentials(body.email, body.password);
    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    res.json({ user: exposeUser(user), token });
  }),

  me: asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user.id);
    if (!user) {
      throw createHttpError(404, 'Usuario no encontrado');
    }
    res.json({ user: exposeUser(user) });
  })
};
