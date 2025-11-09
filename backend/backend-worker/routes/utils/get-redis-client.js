import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();

let client;

export default async function getRedisClient () {
    if (!client) {
        client = createClient ({url: process.env.REDIS_URL});

        client.on('error', (error) => console.error ('Redis Client Error:', error));

        await client.connect();
        console.log('Connected to Redis');
    }

    return client;
}