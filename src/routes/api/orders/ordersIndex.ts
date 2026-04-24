import {Router, Request, Response} from 'express';

const ordersRouter = Router();

ordersRouter.get('/',(req: Request,res: Response) => {
    res.send('Orders route');
});

export default ordersRouter;