const createHttpError = require('../utils/httpError');

// Permite restringir rutas a roles específicos.
module.exports = (allowedRoles = []) => (req, res, next) => {
  if (!req.usuario || !req.usuario.role) {
    return next(createHttpError(401, 'Token requerido'));
  }
  if (!allowedRoles.includes(req.usuario.role)) {
    return next(createHttpError(403, 'No tienes permisos para realizar esta accion'));
  }
  return next();
};
