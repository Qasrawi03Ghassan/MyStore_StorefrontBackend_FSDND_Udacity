import {Router, Request, Response} from 'express';

const usersRouter = Router();

usersRouter.get('/',(req: Request,res: Response) => {
    res.send('Users route');
});

export default usersRouter;