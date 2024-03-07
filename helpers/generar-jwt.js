import jwt from 'jsonwebtoken';
import { User } from '../models/user.js'

export const generarJWT = (uid = '') => {
    
    return new Promise((resolve, reject) => {
        
        const payload = { uid };

        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '6h'
        },(err, token) => {
            
            if(err){
                console.log(err);
                reject('No se puedo generar el JWT token');
            }else{
                resolve(token);
            }
        })



    })
}


export const comprobarJWT = async(token = '') => {

    try {
      if(token.length < 10){
          return null;
      }
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await User.findById(uid);

        if(usuario){
           if(usuario.estado){
            return usuario;
           }else{
            return null;
           }
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }

}