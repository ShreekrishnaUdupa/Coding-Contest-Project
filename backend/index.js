const dotenv = require ('dotenv').config();
const express = require ('express');
const cors = require ('cors');
const RegisterRoute = require ('./routes/register.route');

const app = express ();

app.use(cors({origin: '*'}));
app.use(express.json());

app.use(RegisterRoute);

app.listen(4000, () => {
    console.log('Server running on port 4000');
});