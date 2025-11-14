const { ZodError } = require('zod');
const createHttpError = require('../utils/httpError');

const validate = (schema) => (req, res, next) => {
  if (!schema) {
    return next();
  }

  try {
    const result = schema.parse({
      body: req.body ?? {},
      params: req.params ?? {},
      query: req.query ?? {}
    });
    req.validated = result;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.errors.map((issue) => issue.message).join(', ');
      return next(createHttpError(422, message));
    }
    return next(error);
  }
};

module.exports = validate;
