import { WebSocketServer } from 'ws';
import 'dotenv/config';

const SERVER_HOST = process.env.SERVER_HOST;
const SERVER_PORT = parseInt(process.env.SERVER_PORT);

const server = new WebSocketServer({
    address: SERVER_HOST,
    port: parseInt(SERVER_PORT)
});

console.log('Listening on %s:%d', SERVER_HOST, SERVER_PORT);