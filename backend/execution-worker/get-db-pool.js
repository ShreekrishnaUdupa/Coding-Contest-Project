import dotenv from 'dotenv';
import HashRing from 'hashring';
import { Pool } from 'pg';

dotenv.config();

const ring = new HashRing ({
    0: {vnodes: 10},
    1: {vnodes: 10}
})

const shardPools = [
    new Pool ({connectionString: process.env.SHARD0_DATABASE_URL}),
    new Pool ({connectionString: process.env.SHARD1_DATABASE_URL})
]

function getShardDBPool (id) {
    const index = Number(ring.get(id));
    return shardPools[index];
}

export default getShardDBPool;