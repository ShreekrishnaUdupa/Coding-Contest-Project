import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {

    let accessToken = req.cookies.accessToken;

    if (!accessToken && req.headers['authorization'])
        accessToken = req.headers['authorization'].replace('Bearer ', '');

    if (!accessToken)
        return res.status(401).json({error: 'Unauthorized access'});

    try {
        const {id} = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user = {id};
        next ();
    }

    catch (error) {
        console.error('JWT Verification failed');
        return res.status(401).json({error: 'Unauthorized access'});
    }
};

export default verifyToken;