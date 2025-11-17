const router = require('express').Router();
const clienteController = require('../controllers/cliente.controller');
const validate = require('../middleware/validate');
const {
  crearClienteSchema,
  actualizarClienteSchema,
  clienteIdParamsSchema
} = require('../validators/cliente.validator');

router.get('/', clienteController.listar);
router.post('/', validate(crearClienteSchema), clienteController.crear);
router.put('/:id', validate(actualizarClienteSchema), clienteController.actualizar);
router.delete('/:id', validate(clienteIdParamsSchema), clienteController.eliminar);

module.exports = router;
