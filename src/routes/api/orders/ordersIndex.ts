import {Router, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

const ordersRouter = Router();

ordersRouter.get('/',(req: Request,res: Response) => {
    res.send({message: 'Orders route'});
});

export default ordersRouter;