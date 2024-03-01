import jwt from 'jsonwebtoken';


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