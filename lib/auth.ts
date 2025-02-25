import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_NAME = 'auth_token';

export function generateToken(user: { _id: string; role: string }) {
    try {
        const token = jwt.sign({
            userId: user._id,
            role: user.role
        }, JWT_SECRET, {
            expiresIn: '7d'
        });
        return token;
    } catch (error) {
        console.error('Failed to generate token:', error);
        throw new Error('Failed to generate authentication token');
    }
}

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string;
            role: string;
        };
        return decoded;
    } catch {
        return null;
    }
}