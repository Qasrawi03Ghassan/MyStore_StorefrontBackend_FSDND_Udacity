import {Router, Request, Response} from 'express';

const productsRouter = Router();

productsRouter.get('/',(req: Request,res: Response) => {
    res.send('Products route');
});

export default productsRouter;