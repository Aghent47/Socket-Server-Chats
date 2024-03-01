import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import routerUsers from '../routes/users.js';
import auth from '../routes/auth.js'
import routerCategorias from '../routes/categorias.js';
import routerProductos from '../routes/productos.js';
import routerBuscar from '../routes/buscar.js';
import reuterUploads from '../routes/uploads.js';
import fileUpload from 'express-fileupload';

import { socketController } from '../sockets/controller.js';


import { dbConnection } from '../database/config.js'; // importar la conexion a la base de datos desde 'database/conf

export class SocketServer {
    constructor() {
        this.app = express();

        this.server = http.createServer(this.app);
        this.io = new Server(this.server); // servidor de socket io

        this.paths = {
            // Urls de las rutas
            auth: '/api/auth',
            buscar: '/api/buscar',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            uploads: '/api/uploads',

        }

        // conectar a la base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Routes
        this.routes();

        // Sockets 
        this.sockets();

    };

    async conectarDB() {
        await dbConnection();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        // Public directory
        this.app.use(express.static('public'));

        // Read and parse body
        this.app.use(express.json());

        // fileUpload - para manejar la carga de archivos.
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
        }));
    }

    routes() {
        this.app.use(this.paths.auth, auth),
        this.app.use(this.paths.usuarios, routerUsers);
        this.app.use(this.paths.categorias, routerCategorias);
        this.app.use(this.paths.productos, routerProductos);
        this.app.use(this.paths.buscar, routerBuscar);
        this.app.use(this.paths.uploads, reuterUploads);

    }

    sockets() {
        this.io.on('connection', socketController);
    }

    listen() {

        this.server.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }

}