import dotenv from 'dotenv';
import HashRing from 'hashring';
import {Pool} from 'pg';

dotenv.config();

const shardPools = [
    new Pool ({connectionString: process.env.SHARD0_DATABASE_URL}),
    new Pool ({connectionString: process.env.SHARD1_DATABASE_URL})
];

const ring = new HashRing ({
    0: {vnodes: 10},
    1: {vnodes: 10}
});

export default function getShardDBPool (contestCode) {

    const index = Number (ring.get(contestCode));
    return shardPools[index];
}
