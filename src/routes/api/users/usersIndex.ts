import {Router, Request, Response} from 'express';

const usersRouter = Router();

usersRouter.get('/',(req: Request,res: Response) => {
    res.status(200).json({message: 'Users route'});
});

export default usersRouter;