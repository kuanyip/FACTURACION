const router = require('express').Router();
const facturaController = require('../controllers/factura.controller');
const validate = require('../middleware/validate');
const {
  crearFacturaSchema,
  actualizarFacturaSchema,
  facturaIdParamsSchema
} = require('../validators/factura.validator');

router.get('/', facturaController.listar);
router.post('/', validate(crearFacturaSchema), facturaController.crear);
router.put('/:id', validate(actualizarFacturaSchema), facturaController.actualizar);
router.delete('/:id', validate(facturaIdParamsSchema), facturaController.eliminar);

module.exports = router;
