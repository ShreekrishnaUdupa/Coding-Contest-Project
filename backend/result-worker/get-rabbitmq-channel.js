import dotenv from 'dotenv';
import amqp from 'amqplib';

dotenv.config();

let connection;
let channel;

async function getRabbitMQChannel () {

    if (!connection) {
        connection = await amqp.connect (process.env.RABBITMQ_URL);
        console.log('Connected to RabbitMQ');

        channel = await connection.createConfirmChannel();

        await channel.assertQueue ('results_queue', {durable: true, maxPriority: 10});
    }

    return channel;
}

export default getRabbitMQChannel;