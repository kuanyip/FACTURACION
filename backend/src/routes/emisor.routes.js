const router = require('express').Router();
const emisorController = require('../controllers/emisor.controller');
const validate = require('../middleware/validate');
const {
  crearEmisorSchema,
  actualizarEmisorSchema,
  emisorIdParamsSchema
} = require('../validators/emisor.validator');

router.get('/', emisorController.listar);
router.post('/', validate(crearEmisorSchema), emisorController.crear);
router.put('/:id', validate(actualizarEmisorSchema), emisorController.actualizar);
router.delete('/:id', validate(emisorIdParamsSchema), emisorController.eliminar);

module.exports = router;
