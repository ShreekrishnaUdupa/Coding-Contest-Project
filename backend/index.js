const express = require ('express');
const cors = require ('cors');
const { Client } = require ('pg');

require('dotenv').config();

const app = express ();

app.use(cors({origin: '*'}));
app.use(express.json());

const client = new Client ({
    connectionString: process.env.DATABASE_URL,
    ssl: {rejectUnauthorized: false}
});

client.connect ()
    .then(() => {
        console.log('Connected to the database successfully');

        app.listen(3000, () => 
            console.log('Server running on port 4000'));
    })

    .catch ((error) =>
        console.log('Connection to database failed')
);