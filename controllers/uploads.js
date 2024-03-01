import { response } from "express";
import { subirArchivo } from "../helpers/subir-archivo.js";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { User, Producto } from "../models/index.js";

import cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL);

const __filename = fileURLToPath(import.meta.url);


export const cargarArchivo = async (req, res = response) => {

    try {
        // const pathFile = await subirArchivo(req.files, ['txt', 'pdf'], 'txts');
        const pathFile = await subirArchivo(req.files, undefined, 'imgs');
        res.json({
            Name: pathFile
        });

    } catch (error) {
        res.status(400).json(error);

    }
}

export const actualizarImagen = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':

            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un Producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        const __dirname = path.dirname(__filename);
        // borrar imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    //grabas en BD
    const pathFile = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = pathFile;

    await modelo.save();

    res.json({
        modelo
    });
}


export const actualizarImagenCloudinary = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':

            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un Producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //Limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[nombreArr.length - 1]; // para extraer la ultima parte del arrego donde esta el nombre de mi imag
        const [public_id] = nombre.split('.');
        cloudinary.v2.uploader.destroy(public_id);
    }

    //subir imagen a cluodinary

    const { secure_url } = await cloudinary.uploader.upload(req.files.archivo.tempFilePath);

    modelo.img = secure_url;

    await modelo.save();

    res.json({
        modelo
    });
}

export const mostrarImagen = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'users':
            modelo = await User.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un Producto con el id ${id}`
                })
            }
            break;
        default:
            return res.status(500).json({ msg: 'Se me olvido validar esto' });
    }

    //Limpiar imagenes previas
    const __dirname = path.dirname(__filename);

    if (modelo.img) {

        // borrar imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImagen)) {
            return res.sendFile(pathImagen);
        }
    }

    const pathImgDefault = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(pathImgDefault);

}