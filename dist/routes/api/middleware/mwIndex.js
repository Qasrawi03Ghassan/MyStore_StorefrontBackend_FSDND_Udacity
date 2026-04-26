import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const verifyAuthToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Missing authorization header, cannot find token' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Invalid token format' });
        }
        const decoded = jwt.verify(token, process.env.PEPPER);
        if (decoded) {
            next();
        }
        else {
            res.status(401).redirect('/api');
        }
    }
    catch (err) {
        res.status(401).json({ error: 'Access denied, invalid token', message: `${err}` });
    }
};
//# sourceMappingURL=mwIndex.js.map