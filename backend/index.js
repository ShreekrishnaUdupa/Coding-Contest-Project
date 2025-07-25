const express = require ('express');
const cors = require ('cors');
const { Pool } = require ('pg');

require('dotenv').config();

const app = express ();

app.use(cors({origin: '*'}));
app.use(express.json());

const pool = new Pool ({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
});

app.listen(4000, () => {
    console.log('Server running on port 4000');
});