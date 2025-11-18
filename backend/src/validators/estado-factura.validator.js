const { z } = require('zod');

const idParamsSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int('ID invalido').positive('ID invalido')
    })
    .strict()
});

const baseEstadoSchema = z
  .object({
    codigo: z.string().trim().min(2, 'Codigo requerido').max(20),
    codigoSii: z.coerce.number().int('Codigo SII invalido').nonnegative('Codigo SII invalido').optional(),
    nombre: z.string().trim().min(2, 'Nombre requerido').max(50),
    descripcion: z.string().trim().max(200).optional().or(z.literal('').transform(() => undefined)),
    esFinal: z
      .boolean({ invalid_type_error: 'Valor invalido' })
      .optional()
      .or(z.literal(0).transform(() => false))
      .or(z.literal(1).transform(() => true))
  })
  .strict();

const crearEstadoFacturaSchema = z.object({
  body: baseEstadoSchema
});

const actualizarEstadoFacturaSchema = z.object({
  params: idParamsSchema.shape.params,
  body: baseEstadoSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, { message: 'Debes enviar al menos un campo para actualizar' })
});

const estadoFacturaIdParamsSchema = idParamsSchema;

module.exports = {
  crearEstadoFacturaSchema,
  actualizarEstadoFacturaSchema,
  estadoFacturaIdParamsSchema
};
