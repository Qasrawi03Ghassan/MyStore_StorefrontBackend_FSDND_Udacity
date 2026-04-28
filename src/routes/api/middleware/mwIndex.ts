import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({quiet: true});

export const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({error: 'Missing authorization header, cannot find token'});
        }
        const token = authHeader.split(' ')[1];
        if(!token){
            return res.status(401).json({error: 'Invalid token format'});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecretkey!23') as jwt.JwtPayload;
        if(decoded){
            (req as any).userId = decoded.id; // used any to attach userId to the request from provided token
            next();
        }
        else{
            res.status(401).redirect('/api');
        }
    } catch (err) {
        res.status(401).json({error: 'Access denied, invalid token', message:`${err}`});
    }
};