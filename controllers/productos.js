import { request, response } from "express";
import { Producto } from "../models/index.js";

export const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...resto } = req.body;

    const productoDB = await Producto.findOne({ nombre: resto.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe!!`
        });
    }

    // Generar la data a guardar
    const data = {
        ...resto, // vienes todas las demas propiedades del objeto
        nombre: resto.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //guardar en BD
    await producto.save();

    res.status(201).json(producto);

}

export const getProductos = async (req = request, res = response) => {
    const { limit = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [productos, total] = await Promise.all([
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre'),
        Producto.countDocuments({ estado: true })
    ]);

    res.json({
        msg: 'get API - categorias',
        total,
        productos

    });
}

export const getProductoById = async (req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById(id).populate('categoria', 'name').populate('usuario', 'nombre');

    res.json({
        producto
    });
}

export const actulizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id; // el usuario que lo está actulizando

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

    res.json({
        msg: 'Producto Actualizado con Exito!!',
        producto
    });

}

export const borrarProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const productoBorrado = await Producto.findByIdAndUpdate(id,
        { estado: false }, { new: true });


    res.json({
        msg: 'Categoria Eliminada con Exito!!',
        productoBorrado,
    });
}