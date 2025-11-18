const router = require('express').Router();
const condicionPagoController = require('../controllers/condicion-pago.controller');
const validate = require('../middleware/validate');
const {
  crearCondicionPagoSchema,
  actualizarCondicionPagoSchema,
  condicionPagoIdParamsSchema
} = require('../validators/condicion-pago.validator');

router.get('/', condicionPagoController.listar);
router.post('/', validate(crearCondicionPagoSchema), condicionPagoController.crear);
router.put('/:id', validate(actualizarCondicionPagoSchema), condicionPagoController.actualizar);
router.delete('/:id', validate(condicionPagoIdParamsSchema), condicionPagoController.eliminar);

module.exports = router;
