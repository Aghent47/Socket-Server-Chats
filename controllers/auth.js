import { response } from "express";
import { User } from "../models/user.js";
import bcrypt from 'bcryptjs';
import { generarJWT } from "../helpers/generar-jwt.js";
import { googleVerify } from "../helpers/google-verify.js";

export const login = async (req, res = response) => {

    const { mail, password } = req.body;


    try {

        // verificar si el mail existe
        const usuario = await User.findOne({ mail });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - mail'
            });
        }

        // verificar si el usuario esta activo

        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        //  verificar la contraseña

        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - pass'
            });
        }

        // generar el JWT token

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

export const googleSingIn = async (req, res = response) => {

    const { id_token } = req.body; // obteniendo el id_token en el backend

    try {
      

        const {name, img, mail} = await googleVerify(id_token);

        let usuario = await User.findOne({ mail });
        
        if (!usuario) {
            // tengo que crearlo
            const data = {
                name,
                mail,
                rol: 'USER_ROLE',
                password: '123456',
                img,
                google: true
            };

            usuario = new User(data);
            await usuario.save();
        }

        // Si el usuario en DB tiene estado en false

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {
        res.status(400).json({
            msg: 'Token de google no es valido'
        });
    }


}

export const renovarToken = async ( req, res = response ) => {
    
        const { usuario } = req;
    
        // Generar un nuevo JWT y retornarlo en la peticion
        const token = await generarJWT( usuario.id );
    
        res.json({
            usuario,
            token
        });
}