const pool = require ('../utils/db');

const registerUser = async (req, res) => {

    const {username, email, password} = req.body;
    const client = await pool.connect ();
    let results;

    try {
        results = await client.query ('SELECT username FROM users where username = $1', [username]);

        if (results.rows.length !== 0)
            return res.status(409).json({error: 'Username already exists. Please enter a different username'});

        results = await client.query ('SELECT email FROM users where email = $1', [email]);

        if (results.rows.length !== 0)
            return res.status(409).json({error: 'Email already exists. Please enter a different email'});

        return res.status(201).end();
    }

    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'});
    }
};

module.exports = {registerUser};