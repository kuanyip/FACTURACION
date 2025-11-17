const router = require('express').Router();
const estadoFacturaController = require('../controllers/estado-factura.controller');
const validate = require('../middleware/validate');
const {
  crearEstadoFacturaSchema,
  actualizarEstadoFacturaSchema,
  estadoFacturaIdParamsSchema
} = require('../validators/estado-factura.validator');

router.get('/', estadoFacturaController.listar);
router.post('/', validate(crearEstadoFacturaSchema), estadoFacturaController.crear);
router.put('/:id', validate(actualizarEstadoFacturaSchema), estadoFacturaController.actualizar);
router.delete('/:id', validate(estadoFacturaIdParamsSchema), estadoFacturaController.eliminar);

module.exports = router;
