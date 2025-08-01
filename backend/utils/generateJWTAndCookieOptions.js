const jwt = require ('jsonwebtoken');
const ms = require ('ms');

const generateJWTAndCookieOptions = async (id) => {

    const accessToken = jwt.sign (
        {id},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign (
        {id},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    const accessTokenCookieOption = {
        httpOnly: true,
        secure: true,
        maxAge: ms (process.env.ACCESS_TOKEN_EXPIRY)
    }

    const refreshTokenCookieOption = {
        httpOnly: true,
        secure: true,
        maxAge: ms (process.env.REFRESH_TOKEN_EXPIRY)
    }

    return {accessToken, refreshToken, accessTokenCookieOption, refreshTokenCookieOption};
};

module.exports = generateJWTAndCookieOptions;