const router = require('express').Router();
const invoiceController = require('../controllers/invoice.controller');
const validate = require('../middleware/validate');
const {
  createInvoiceSchema,
  updateInvoiceSchema,
  invoiceIdParamsSchema
} = require('../validators/invoice.validator');

router.get('/', invoiceController.list);
router.post('/', validate(createInvoiceSchema), invoiceController.create);
router.put('/:id', validate(updateInvoiceSchema), invoiceController.update);
router.delete('/:id', validate(invoiceIdParamsSchema), invoiceController.remove);

module.exports = router;
