const { z } = require('zod');

const idParamsSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int('ID invalido').positive('ID invalido')
    })
    .strict()
});

const baseSchema = z
  .object({
    codigo: z.coerce.number().int('Codigo invalido'),
    nombre: z.string().trim().min(2, 'Nombre requerido').max(80),
    descripcion: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined))
  })
  .strict();

const crearCondicionPagoSchema = z.object({
  body: baseSchema
});

const actualizarCondicionPagoSchema = z.object({
  params: idParamsSchema.shape.params,
  body: baseSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, { message: 'Debes enviar al menos un campo para actualizar' })
});

const condicionPagoIdParamsSchema = idParamsSchema;

module.exports = {
  crearCondicionPagoSchema,
  actualizarCondicionPagoSchema,
  condicionPagoIdParamsSchema
};
