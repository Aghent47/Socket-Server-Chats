import { Socket } from "socket.io";

export const socketController = ( socket = new Socket() ) => {
    console.log('Cliente Conectado', socket.id);

    

}