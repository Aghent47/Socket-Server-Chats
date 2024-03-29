import { Socket } from "socket.io";
import { comprobarJWT } from "../helpers/generar-jwt.js";
import { ChatMensajes } from "../models/index.js";

const chatMensajes = new ChatMensajes(); // solo se ejecuta cuando el servidor se levanta

export const socketController = async (socket = new Socket(), io) => {

     //validación de mi JWT en mi backend
     const usuario = await comprobarJWT(socket.handshake.headers['x-token']);
     if (!usuario) {
          return socket.disconnect();
     }
     //agregar el usuario conectado (Aqui se conecta alguien)
     chatMensajes.conectarUsuario(usuario);
     io.emit('usuarios-activos', chatMensajes.usuariosArr);
     socket.emit('recibir-mensajes', chatMensajes.ultimos10);

     //conectarlo a una sala privada
     socket.join(usuario.id); //global, socket.id, usuario.id


     //limpiar cuando alguien se desconecte
     socket.on('disconnect', () => {
          chatMensajes.desconectarUsuario(usuario.id);
          io.emit('usuarios-activos', chatMensajes.usuariosArr);
     });

     socket.on('enviar-mensaje', ({ uid, mensaje }) => {

          if (uid) {
               //mensaje privado
               socket.to( uid ).emit( 'mensaje-privado', { de: usuario.name, mensaje })
          } else {
               chatMensajes.enviarMensaje(usuario.id, usuario.name, mensaje);
               io.emit('recibir-mensajes', chatMensajes.ultimos10);
          }
     })

}