const { z } = require('zod');

const idParamsSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int('ID invalido').positive('ID invalido')
    })
    .strict()
});

const baseCustomerSchema = z
  .object({
    name: z.string().trim().min(3, 'Nombre requerido').max(150),
    email: z.string().email('Correo invalido').max(160),
    taxId: z.string().trim().min(3, 'RFC / NIT invalido').max(45),
    phone: z
      .string()
      .trim()
      .min(5, 'Telefono invalido')
      .max(45)
      .optional()
      .or(z.literal('').transform(() => undefined)),
    address: z.string().trim().min(5, 'Direccion muy corta').max(255)
  })
  .strict();

const createCustomerSchema = z.object({
  body: baseCustomerSchema
});

const updateCustomerSchema = z.object({
  params: idParamsSchema.shape.params,
  body: baseCustomerSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Debes enviar al menos un campo para actualizar'
    })
});

const customerIdParamsSchema = idParamsSchema;

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
  customerIdParamsSchema
};
