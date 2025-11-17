const router = require('express').Router();
const formaPagoController = require('../controllers/forma-pago.controller');
const validate = require('../middleware/validate');
const {
  crearFormaPagoSchema,
  actualizarFormaPagoSchema,
  formaPagoIdParamsSchema
} = require('../validators/forma-pago.validator');

router.get('/', formaPagoController.listar);
router.post('/', validate(crearFormaPagoSchema), formaPagoController.crear);
router.put('/:id', validate(actualizarFormaPagoSchema), formaPagoController.actualizar);
router.delete('/:id', validate(formaPagoIdParamsSchema), formaPagoController.eliminar);

module.exports = router;
