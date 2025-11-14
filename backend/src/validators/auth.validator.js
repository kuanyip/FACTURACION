const { z } = require('zod');

const roles = ['admin', 'staff'];

const registerBodySchema = z
  .object({
    name: z.string().min(3, 'El nombre es requerido').max(120),
    email: z.string().email('Correo invalido').max(160),
    password: z.string().min(6, 'Minimo 6 caracteres').max(255),
    role: z.enum(roles, { required_error: 'Rol invalido' }).optional()
  })
  .strict();

const loginBodySchema = z
  .object({
    email: z.string().email('Correo invalido').max(160),
    password: z.string().min(6, 'Minimo 6 caracteres').max(255)
  })
  .strict();

const registerSchema = z.object({
  body: registerBodySchema
});

const loginSchema = z.object({
  body: loginBodySchema
});

module.exports = {
  registerSchema,
  loginSchema
};
