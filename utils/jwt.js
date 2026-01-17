import jwt from 'jsonwebtoken';


const generateAccessToken = (user) => {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const payload = {
        userId: user.id,
        email: user.email,
        tokenVersion: user.tokenVersion
    };

    const expiresIn = process.env.JWT_LIFETIME || '15m';
    const token = jwt.sign(payload, secret, {
        expiresIn
    });

    return token;
}



const generateRefreshToken = (user) => {
    const secret= process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET or JWT_SECRET is not defined');
    }

    const payload = {
        userId: user.id,
        email: user.email,
        tokenVersion: user.tokenVersion
    };

    const expiresIn = process.env.JWT_REFRESH_LIFETIME || '7d';
    const token = jwt.sign(payload, secret, {
        expiresIn
    });

    return token;
}



const verifyAccessToken = (token) => {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid token');
        }
        throw error;
    }
}



const verifyRefreshToken = (token) => {
    const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET or JWT_SECRET is not defined');
    }

    try {
        const payload = jwt.verify(token, secret);
        return payload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw error;
    }
}



export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };