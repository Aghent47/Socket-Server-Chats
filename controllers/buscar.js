import { response } from "express";
import { Types } from "mongoose";
import { User, Categoria, Producto } from "../models/index.js";

const { ObjectId } = Types;

const coleccionPermitidas = [
    'users',
    'categorias',
    'productos',
    'roles',
]

const buscarUsuarios =  async (termino = '' , res = response) => {

    const esMongoId = ObjectId.isValid(termino); // si es un id de mongo retorna true

    if (esMongoId) {
        const usuario = await User.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await User.find({ 
        $or: [{ name: regex }, { mail: regex }],
        $and: [{ estado: true }]
     });

    res.json({
        results: usuarios
    })
}

const buscarCategorias =  async (termino = '' , res = response) => {

    const esMongoId = ObjectId.isValid(termino); // si es un id de mongo retorna true

    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({ 
        $or: [{ nombre: regex }],
        $and: [{ estado: true }]
     });

    res.json({
        results: categorias
    })
}

const buscarProductos =  async (termino = '' , res = response) => {

    const esMongoId = ObjectId.isValid(termino); // si es un id de mongo retorna true

    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre')
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({ 
        $or: [{ nombre: regex }, {descrpcion: regex}],
        $and: [{ estado: true }]
     }).populate('categoria', 'nombre')

    res.json({
        results: productos
    })
}



export const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionPermitidas}`
        })
    }

    switch (coleccion) {
        case 'users':
            buscarUsuarios(termino, res);
            break;

        case 'categorias':
            buscarCategorias(termino, res);
            break;

        case 'productos':

            buscarProductos(termino, res);

            break;

        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta busqueda'
            })
            break;

    }

}