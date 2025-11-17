const { z } = require('zod');

const idParamsSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int('ID invalido').positive('ID invalido')
    })
    .strict()
});

const baseFormaSchema = z
  .object({
    codigo: z.string().trim().min(1, 'Codigo requerido').max(20),
    nombre: z.string().trim().min(2, 'Nombre requerido').max(50),
    descripcion: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined))
  })
  .strict();

const crearFormaPagoSchema = z.object({
  body: baseFormaSchema
});

const actualizarFormaPagoSchema = z.object({
  params: idParamsSchema.shape.params,
  body: baseFormaSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, { message: 'Debes enviar al menos un campo para actualizar' })
});

const formaPagoIdParamsSchema = idParamsSchema;

module.exports = {
  crearFormaPagoSchema,
  actualizarFormaPagoSchema,
  formaPagoIdParamsSchema
};
