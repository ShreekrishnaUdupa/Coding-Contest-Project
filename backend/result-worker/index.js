import http from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Server } from 'socket.io';
import getRabbitMQChannel from "./get-rabbitmq-channel.js";
import handleCodeSubmit from './handle-code-submit.js';

const server = http.createServer();
const io = new Server (server, {
    cors: {origin: '*', credentials: true}
});

(async () => {
    const pubClient = createClient ({url: process.env.REDIS_URL});
    const subClient = pubClient.duplicate();
    await pubClient.connect();
    await subClient.connect();
    io.adapter(createAdapter(pubClient, subClient));
})();

io.on ('connection', (socket) => {
    const {webSocketId} = socket.handshake.query;
    console.log(`Socket ${socket.id} connected`);

    if (webSocketId) {
        socket.join(webSocketId);
        console.log(`Socket ${socket.id} joined room ${webSocketId}`);
    }
});

server.listen (5000, () => {
    console.log('Websocket service running on port 5000');
});

(async () => {
    const channel = await getRabbitMQChannel();

    channel.consume ('results_queue', async (message) => {

        if (!message) return;

        const decodedMessage = JSON.parse(message.content.toString());
        console.log(decodedMessage);

        const webSocketId = `${decodedMessage.userId}-${decodedMessage.contestCode}-${decodedMessage.problemId}`;
        let results;

        if (decodedMessage.type === 'run')
            results = decodedMessage.results;

        else
            results = await handleCodeSubmit (decodedMessage);

        io.to(webSocketId).emit('codeResult', results);
        channel.ack(message);
    });
})();