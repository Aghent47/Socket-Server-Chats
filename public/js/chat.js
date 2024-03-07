const url = (window.location.origin.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://rest-server-actualizado-production.up.railway.app/api/auth/';

let usuario = null;
let socket = null;

// Referencias del HTML
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje'); 
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');



// validar el token del localStorage
const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url,{
        headers: {
            'x-token': token
        }
    });

    const { usuario: userDB, token: tokenDB } = await resp.json();
    // console.log(userDB, tokenDB);
    localStorage.setItem('token', tokenDB);
    usuario = userDB;

    document.title = usuario.name;

    await conectarSocket();
}

// funcion para establecer mi backend server io
const conectarSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connection', () => {
        console.log('Sockets online');
    });
    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recibir-mensajes', () => {

    });

    socket.on('usuarios-activos',() => {
        
    });
    
    socket.on('mensaje-privado',() => {
        
    });
    
}

const main = async() => {

    //validar el JWT
    await validarJWT();


}

main();