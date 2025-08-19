import jwt from 'jsonwebtoken';
import ms from 'ms';

const generateJWTAndCookieOptions = (id) => {

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

export default generateJWTAndCookieOptions;