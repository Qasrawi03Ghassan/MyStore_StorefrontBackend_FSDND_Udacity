import {Router, Request, Response} from 'express';
import {User, createUser, getUsers,showUserById} from '../../../models/user/user.js';

const usersRouter = Router();

//Todo: add jwt
usersRouter.get('/',async (req: Request,res: Response) => {
    try{
        const users: User[] = await getUsers();
        res.status(200).json({users});
    }catch(err :any){
        res.status(500).json({error: 'Failed to fetch users',stack: err.stack});
    }
});

//Todo: add jwt
usersRouter.get('/:id',async (req: Request,res: Response) => {
    const userId = Number(req.params.id);
    if(userId <= 0 || Number.isNaN(userId)){
        console.error('Invalid user ID parameter');
        return res.status(400).json({error: 'Invalid user ID parameter, must be a positive integer'});
    }
    try{
        const user: User = await showUserById(userId);
        res.status(200).json({user});
    }catch(err :any){
        res.status(500).json({error: 'Failed to fetch user',stack: err.stack});
    }
});

//Todo: add jwt
usersRouter.post('/',async (req: Request,res: Response) => {
    try{
        const user: User = await createUser(req.body);
        res.status(200).json({user});
    }catch(err :any){
        res.status(500).json({error: 'Failed to create user',stack: err.stack});
    }
});
export default usersRouter;