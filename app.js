import 'dotenv/config';
import { SocketServer } from './models/server.js';

const server = new SocketServer();

server.listen();
