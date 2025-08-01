const jwt = require ('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const accessToken = req.cookies.accessToken || req.headers['authorization'].replace('Bearer ', '');

    if (!accessToken)
        return res.status(401).json({error: 'Unauthorized access'});

    try {
        const {id} = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = {id}
        next ();
    }

    catch (error) {
        console.log('JWT Verification failed');
        return res.status(401).json({error: 'Unauthorized access'});
    }
};

module.exports = verifyToken;