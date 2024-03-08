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
const validarJWT = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch(url, {
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
const conectarSocket = async () => {
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

    socket.on('recibir-mensajes', dibujarMensajes);

    socket.on('usuarios-activos', dibujarUsuarios);

    socket.on('mensaje-privado', () => {
        
    });

}

const dibujarUsuarios = (usuarios = []) => {
    let userHtml = '';

    usuarios.forEach(({ name, uid }) => {
        userHtml += ` <li>
            <p>
                <h5 class="text-success">
                    ${name}
                    <span class="fs-6 text-muted" >
                        ${uid}
                    </span>
                </h5>
            </p>
        </li> `;
    });

    ulUsuarios.innerHTML = userHtml;
}

const dibujarMensajes = (mensajes = []) => {
    let mensajesHtml = '';

    mensajes.forEach(({ name, mensaje }) => {
        mensajesHtml += ` <li>
            <p>
                <span class="text-primary"> ${name}: </span>
                <span> ${mensaje} </span>
            </p>
        </li> `;
    });

    ulMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if (keyCode !== 13) { return; }
    if (mensaje.length === 0) { return; }

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';
});

const main = async () => {

    //validar el JWT
    await validarJWT();
}

main();