const { z } = require('zod');

const statusValues = ['draft', 'sent', 'paid', 'overdue'];

const dateSchema = (message) =>
  z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message })
    .transform((value) => value);

const idParamsSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int('ID invalido').positive('ID invalido')
    })
    .strict()
});

const applyDateRangeRefinement = (schema) =>
  schema.superRefine((data, ctx) => {
    if (data.issueDate && data.dueDate) {
      const issue = new Date(data.issueDate);
      const due = new Date(data.dueDate);
      if (issue > due) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'La fecha de vencimiento debe ser posterior a la de emision',
          path: ['dueDate']
        });
      }
    }
  });

const invoiceBodySchema = z
  .object({
    customerId: z.coerce.number().int('Cliente invalido').positive('Cliente invalido'),
    description: z.string().trim().min(3, 'Descripcion muy corta').max(255),
    total: z.coerce.number().nonnegative('El monto debe ser mayor o igual a 0'),
    status: z.enum(statusValues, { invalid_type_error: 'Estado invalido' }).default('draft'),
    issueDate: dateSchema('Fecha de emision invalida'),
    dueDate: dateSchema('Fecha de vencimiento invalida')
  })
  .strict();

const baseInvoiceSchema = applyDateRangeRefinement(invoiceBodySchema);

const createInvoiceSchema = z.object({
  body: baseInvoiceSchema
});

const updateInvoiceSchema = z.object({
  params: idParamsSchema.shape.params,
  body: applyDateRangeRefinement(
    invoiceBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
      message: 'Debes enviar al menos un campo'
    })
  )
});

const invoiceIdParamsSchema = idParamsSchema;

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
  invoiceIdParamsSchema
};
