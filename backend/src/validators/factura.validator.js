const { z } = require('zod');

const enumCondicion = ['CONTADO', 'CREDITO'];
const dateSchema = (message) =>
  z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message })
    .transform((value) => value);

const decimalSchema = (message) =>
  z
    .union([z.number(), z.string()])
    .transform((val) => Number(val))
    .refine((val) => !Number.isNaN(val), { message })
    .refine((val) => val >= 0, { message });

const idParamsSchema = z.object({
  params: z
    .object({
      id: z.coerce.number().int('ID invalido').positive('ID invalido')
    })
    .strict()
});

const detalleSchema = z
  .object({
    descripcion: z.string().trim().min(1, 'Descripcion requerida').max(255),
    cantidad: decimalSchema('Cantidad invalida'),
    precioUnitario: decimalSchema('Precio invalido'),
    descuentoPorcentaje: decimalSchema('Descuento invalido').optional(),
    descuentoMonto: decimalSchema('Descuento invalido').optional(),
    subtotal: decimalSchema('Subtotal invalido').optional()
  })
  .strict();

const impuestoSchema = z
  .object({
    codigoImpuesto: z.string().trim().min(1, 'Codigo requerido').max(20),
    descripcion: z.string().trim().max(120).optional(),
    monto: decimalSchema('Monto invalido')
  })
  .strict();

const referenciaSchema = z
  .object({
    tipoDoc: z.string().trim().min(1, 'Tipo requerido').max(20),
    folioRef: z.string().trim().min(1, 'Folio requerido').max(50),
    fechaRef: dateSchema('Fecha de referencia invalida'),
    motivo: z.string().trim().max(200).optional()
  })
  .strict();

const baseFacturaSchema = z
  .object({
    tipoDte: z.coerce.number().int('Tipo DTE invalido'),
    folio: z.coerce.number().int('Folio invalido'),
    fechaEmision: dateSchema('Fecha de emision invalida'),
    moneda: z.string().trim().length(3, 'Moneda invalida').default('CLP'),
    emisorId: z.coerce.number().int('Emisor invalido').positive('Emisor invalido'),
    clienteId: z.coerce.number().int('Cliente invalido').positive('Cliente invalido'),
    condicionPago: z.enum(enumCondicion, { invalid_type_error: 'Condicion de pago invalida' }).default('CONTADO'),
    formaPagoId: z.coerce.number().int('Forma de pago invalida').positive('Forma de pago invalida'),
    fechaVencimiento: dateSchema('Fecha de vencimiento invalida').optional(),
    ordenCompra: z.string().trim().max(50).optional(),
    netoAfecto: decimalSchema('Neto afecto invalido').default(0),
    netoExento: decimalSchema('Neto exento invalido').default(0),
    otrosCargos: decimalSchema('Otros cargos invalidos').default(0),
    impuestoEspecifico: decimalSchema('Impuesto especifico invalido').default(0),
    montoIva: decimalSchema('Monto IVA invalido').default(0),
    total: decimalSchema('Total invalido'),
    estadoFacturaId: z.coerce.number().int('Estado invalido').positive('Estado invalido'),
    detalles: z.array(detalleSchema).optional(),
    impuestos: z.array(impuestoSchema).optional(),
    referencias: z.array(referenciaSchema).optional()
  })
  .strict();

const crearFacturaSchema = z.object({
  body: baseFacturaSchema
});

const actualizarFacturaSchema = z.object({
  params: idParamsSchema.shape.params,
  body: baseFacturaSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'Debes enviar al menos un campo'
    })
});

const facturaIdParamsSchema = idParamsSchema;

const facturaEstadoParamsSchema = z.object({
  params: z
    .object({
      estadoId: z.coerce.number().int('Estado invalido').positive('Estado invalido')
    })
    .strict()
});

module.exports = {
  crearFacturaSchema,
  actualizarFacturaSchema,
  facturaIdParamsSchema,
  facturaEstadoParamsSchema
};
