import { fileURLToPath } from 'url';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);

export const subirArchivo = (files, extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    
    return new Promise((resolve, reject) => {

        const __filename = fileURLToPath(import.meta.url);
        const { archivo } = files
        const __dirname = path.dirname(__filename);
        const newNameFile = archivo.name.split('.');

        //sacar extension del archivo
        const extension = newNameFile[newNameFile.length - 1];

        //validar la extenciones
        if (!extencionesValidas.includes(extension)) {
            return reject(`La extencion ${extension} no es permitida, las permitidas son ${extencionesValidas}`);
        }

        const nameTemporalFile = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nameTemporalFile);

        archivo.mv(uploadPath, (err) => {
            if (err) reject(err);
           resolve(nameTemporalFile);
        });

    });

}