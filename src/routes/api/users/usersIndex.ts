import {Router, Request, Response} from 'express';
import {User, createUser, getUsers,showUserById} from '../../../models/user/user.js';
import {verifyAuthToken} from '../middleware/mwIndex.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({quiet: true});

const usersRouter = Router();

usersRouter.get('/', verifyAuthToken,async (req: Request,res: Response) => {

    try{
        const users: User[] = await getUsers();
        res.status(200).json({"message": "Users fetched successfully", "users": users});
    }catch(err :unknown){
        res.status(500).json({error: 'Failed to fetch users',stack: (err as Error).stack});
    }
});

usersRouter.post('/',async (req: Request,res: Response) => {
    const {first_name, last_name, password} = req.body;
    if(!first_name || !last_name || !password){
        return res.status(400).json({error: 'Missing required fields: first_name, last_name, and password are required'});
    }
    try{
        const password_digest = bcrypt.hashSync(password + process.env.PEPPER, Number.parseInt(process.env.SALT as string) || 10);
        const user: User = await createUser({first_name, last_name, password_digest});

        const createdToken: string = jwt.sign(
            {
                id:user.id,
                first_name:user.first_name,
                last_name:user.last_name
            },
            process.env.JWT_SECRET || 'defaultsecretkey!23',
            {expiresIn: '1h'}
        )

        res.status(201).json({"message": "User created successfully", "user":user,"token":createdToken});
    }catch(err :unknown){
        res.status(500).json({error: 'Failed to create user',stack: (err as Error).stack});
    }
});

usersRouter.get('/:id', verifyAuthToken,async (req: Request,res: Response) => {
    const userId = Number(req.params.id);
    if(userId <= 0 || Number.isNaN(userId)){
        console.error('Invalid user ID parameter');
        return res.status(400).json({error: 'Invalid user ID parameter, must be a positive integer'});
    }
    try{
        const user: User = await showUserById(userId);
        if(!user){
            return res.status(404).json({error:`User with id ${userId} does not exist`});
        }
        res.status(200).json({"message": "User fetched successfully", "user":user});
    }catch(err :unknown){
        res.status(500).json({error: 'Failed to fetch user',stack: (err as Error).stack});
    }
});

export default usersRouter;