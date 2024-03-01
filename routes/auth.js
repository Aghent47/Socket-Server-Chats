import express from 'express';
import { check } from 'express-validator';
import  {login, googleSingIn } from '../controllers/auth.js';
import { validarCampos } from '../middlewares/validar_campos.js';

const router = express.Router();

router.post('/login',[
    check('mail', 'The email is required').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    validarCampos
], login );

router.post('/google',[
    check('id_token', 'The id_token the google is required').not().isEmpty(),

    //TODO: validar que venga el "Rol" o Rol po defecto "USER_ROLE"    
], googleSingIn );

export default router;
