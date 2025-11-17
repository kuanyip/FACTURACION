const { z } = require('zod');

const idParamsSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int('ID invalido').positive('ID invalido')
    })
    .strict()
});

const baseClienteSchema = z
  .object({
    rut: z.string().trim().min(8, 'RUT requerido').max(12),
    razonSocial: z.string().trim().min(3, 'Razon social requerida').max(150),
    giro: z
      .string()
      .trim()
      .max(150, 'Giro muy largo')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    direccion: z
      .string()
      .trim()
      .max(200, 'Direccion muy larga')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    comuna: z
      .string()
      .trim()
      .max(80, 'Comuna muy larga')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    ciudad: z
      .string()
      .trim()
      .max(80, 'Ciudad muy larga')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    telefono: z
      .string()
      .trim()
      .max(30, 'Telefono muy largo')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    email: z
      .string()
      .trim()
      .email('Correo invalido')
      .max(120, 'Correo muy largo')
      .optional()
      .or(z.literal('').transform(() => undefined))
  })
  .strict();

const crearClienteSchema = z.object({
  body: baseClienteSchema
});

const actualizarClienteSchema = z.object({
  params: idParamsSchema.shape.params,
  body: baseClienteSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Debes enviar al menos un campo para actualizar'
    })
});

const clienteIdParamsSchema = idParamsSchema;

module.exports = {
  crearClienteSchema,
  actualizarClienteSchema,
  clienteIdParamsSchema
};
