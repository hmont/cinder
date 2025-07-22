import express from 'express';
import { WebSocketServer } from 'ws';
import http from 'http';
import cors from 'cors';
import 'dotenv/config';

import { createChat } from './routes/chat.js';
import { redisClient } from './controllers/redis.js';
import { setupWSHandlers } from './ws/handlers.js';

const PORT = parseInt(process.env.SERVER_PORT);

export const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use(cors());

app.post('/api/chat/create', createChat);

server.listen(PORT, async () => {
    await redisClient.connect();
    setupWSHandlers(wss);
    console.log(`Server listening on http://localhost:${PORT}`);
});