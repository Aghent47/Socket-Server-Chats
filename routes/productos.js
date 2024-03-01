import { Router,} from "express";
import { actulizarProducto, borrarProducto, crearProducto, getProductoById, getProductos } from "../controllers/productos.js";
import { check } from "express-validator";
import { esAdminRole, validarCampos, validarJWT } from "../middlewares/index.js";
import { existeCategoriaById, existeProductoById } from "../helpers/db_validators.js";

const router = Router();

// Crear una nueva producto - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatorio').isMongoId(),
    check('categoria',).custom(existeCategoriaById),
    validarCampos,
], crearProducto );

// Obtener todos los productos - publico

router.get('/', getProductos );

// Obtener una Producto por id - path publico
router.get('/:id', [
    check('id', 'No es un ID valido').isMongoId(),
    check('id',).custom(existeProductoById),
    validarCampos

], getProductoById );

// Actualizar - privado - cualquier persona con un token valido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID valido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id',).custom(existeProductoById),
    validarCampos

], actulizarProducto );

// Borrar una producto - Admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id',).custom(existeProductoById),
    validarCampos

], borrarProducto )


export default router;