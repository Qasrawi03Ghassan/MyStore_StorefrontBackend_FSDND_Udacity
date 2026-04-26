import {Router, Request, Response} from 'express';
import { createOrder, getCompletedOrders, getCurrentOrders, Order} from '../../../models/order/order.js';
import jwt from 'jsonwebtoken';

const ordersRouter = Router();

//TODO: add jwt
ordersRouter.get('/', async (req: Request,res: Response) => {
    try{
        const orders: Order[] = await getCurrentOrders(req.body.user_id);
        res.status(200).json(orders);
    }catch(err: any){ //Error type is unknown, so using any
        res.status(500).json({message: 'Error fetching active orders',stack: err.stack});
    }
});

//TODO: add jwt
ordersRouter.get('/completed', async (req: Request,res: Response) => {
    try{
        const orders: Order[] = await getCompletedOrders(req.body.user_id);
        res.status(200).json(orders);
    }catch(err: any){ //Error type is unknown, so using any
        res.status(500).json({message: 'Error fetching completed orders',stack: err.stack});
    }
});

//TODO: add jwt
ordersRouter.post('/', async (req: Request,res: Response) => {
    try{
        const order: Order = await createOrder(req.body, req.body.product_id, req.body.quantity);
        res.status(200).json({order});
    }catch(err: any){ //Error type is unknown, so using any
        res.status(500).json({message: 'Error creating order',stack: err.stack});
    }
});

export default ordersRouter;