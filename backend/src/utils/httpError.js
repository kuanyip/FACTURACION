module.exports = function createHttpError(status = 500, message = 'Error inesperado') {
  const error = new Error(message);
  error.status = status;
  return error;
};
