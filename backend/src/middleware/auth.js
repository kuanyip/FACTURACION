const createHttpError = require('../utils/httpError');
const { verifyToken } = require('../utils/token');

module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(createHttpError(401, 'Token requerido'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return next(createHttpError(401, 'Token invalido'));
  }
};
