const { z } = require('zod');

const roles = ['admin', 'revisor', 'digitador'];
const estados = ['activo', 'inactivo'];

const usuarioIdParamsSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int('ID invalido').positive('ID invalido')
    })
    .strict()
});

const crearUsuarioSchema = z.object({
  body: z
    .object({
      name: z.string().min(3, 'El nombre es requerido').max(120),
      email: z.string().email('Correo invalido').max(160),
      password: z.string().min(6, 'Minimo 6 caracteres').max(255),
      role: z.enum(roles, { required_error: 'Rol invalido' }).default('digitador'),
      status: z.enum(estados).default('activo')
    })
    .strict()
});

const actualizarUsuarioSchema = z.object({
  params: usuarioIdParamsSchema.shape.params,
  body: z
    .object({
      name: z.string().min(3, 'El nombre es requerido').max(120).optional(),
      email: z.string().email('Correo invalido').max(160).optional(),
      password: z.string().min(6, 'Minimo 6 caracteres').max(255).optional(),
      role: z.enum(roles, { required_error: 'Rol invalido' }).optional(),
      status: z.enum(estados).optional()
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, { message: 'Debes enviar al menos un campo' })
});

module.exports = {
  roles,
  crearUsuarioSchema,
  actualizarUsuarioSchema,
  usuarioIdParamsSchema
};
