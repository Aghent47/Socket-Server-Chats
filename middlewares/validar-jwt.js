import { response, request } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

export const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

       const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // leer el usuario correspodiente al uid
       const usuario = await User.findById( uid );

       if(!usuario) {
              return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
              });
       }

       // Verificar si el usuario existe
         if (!usuario.estado) {
              return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB (estado: False)'
              });
         }
        
       req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}