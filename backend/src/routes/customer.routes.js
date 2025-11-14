const router = require('express').Router();
const customerController = require('../controllers/customer.controller');
const validate = require('../middleware/validate');
const {
  createCustomerSchema,
  updateCustomerSchema,
  customerIdParamsSchema
} = require('../validators/customer.validator');

router.get('/', customerController.list);
router.post('/', validate(createCustomerSchema), customerController.create);
router.put('/:id', validate(updateCustomerSchema), customerController.update);
router.delete('/:id', validate(customerIdParamsSchema), customerController.remove);

module.exports = router;
