const router = require('express').Router();
const usuarioController = require('../controllers/usuario.controller');
const validate = require('../middleware/validate');
const authorize = require('../middleware/authorize');
const {
  crearUsuarioSchema,
  actualizarUsuarioSchema,
  usuarioIdParamsSchema
} = require('../validators/usuario.validator');

// Solo administradores pueden gestionar usuarios
router.use(authorize(['admin']));

router.get('/', usuarioController.listar);
router.get('/:id', validate(usuarioIdParamsSchema), usuarioController.obtener);
router.post('/', validate(crearUsuarioSchema), usuarioController.crear);
router.put('/:id', validate(actualizarUsuarioSchema), usuarioController.actualizar);
router.delete('/:id', validate(usuarioIdParamsSchema), usuarioController.eliminar);

module.exports = router;
