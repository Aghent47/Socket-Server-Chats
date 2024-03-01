import express from 'express';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar_campos.js';
import { actualizarImagen, actualizarImagenCloudinary, cargarArchivo, mostrarImagen } from '../controllers/uploads.js';
import { coleccionesPermitidas } from '../helpers/db_validators.js';
import { validarFileSubir } from '../middlewares/validar-archivo.js';

const router = express.Router();

router.post('/', validarFileSubir, cargarArchivo);

router.put('/:coleccion/:id', [
   validarFileSubir,
   check('id', 'El id debe ser de mongo').isMongoId(),
   check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos'])),
   validarCampos

], actualizarImagenCloudinary);

router.get('/:coleccion/:id',[
   check('id', 'El id debe ser de mongo').isMongoId(),
   check('coleccion').custom(c => coleccionesPermitidas(c, ['users', 'productos'])),
   validarCampos
], mostrarImagen)

export default router;
