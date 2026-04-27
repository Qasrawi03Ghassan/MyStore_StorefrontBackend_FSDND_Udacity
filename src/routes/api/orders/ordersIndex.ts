import {Router, Request, Response} from 'express';
import { createOrder, deleteOrder, getCompletedOrders, getCurrentOrders, Order, updateOrderStatus} from '../../../models/order/order.js';
import { verifyAuthToken } from '../middleware/mwIndex.js';

const ordersRouter = Router();

ordersRouter.get('/', verifyAuthToken,async (req: Request,res: Response) => {
    const user_id = Number(req.query.user_id);
    if(!user_id || user_id === undefined || Number.isNaN(user_id)){
        return res.status(400).json({error:"invalid parameter"})
    }
    try{
        const orders: Order[] = await getCurrentOrders(user_id);
        res.status(200).json({message: 'Active orders fetched successfully', orders});
    }catch(err: any){ //Error type is unknown, so using any
        res.status(500).json({message: 'Error fetching active orders',stack: err.stack});
    }
});

ordersRouter.get('/completed', verifyAuthToken,async (req: Request,res: Response) => {
    const user_id = Number(req.query.user_id);
    if(!user_id || user_id === undefined || Number.isNaN(user_id)){
        return res.status(400).json({error:"invalid parameter"})
    }
    try{
        const orders: Order[] = await getCompletedOrders(user_id);
        res.status(200).json({message: 'Completed orders fetched successfully', orders});
    }catch(err: any){ //Error type is unknown, so using any
        res.status(500).json({message: 'Error fetching completed orders',stack: err.stack});
    }
});

ordersRouter.post('/', verifyAuthToken,async (req: Request,res: Response) => {
    try{
        const order: Order = await createOrder(req.body, req.body.product_id, req.body.quantity);
        res.status(200).json({message: 'Order created successfully', order});
    }catch(err: any){ //Error type is unknown, so using any
        res.status(500).json({message: 'Error creating order',stack: err.stack});
    }
});

ordersRouter.put('/:id', verifyAuthToken,async (req: Request,res: Response) => {
    const orderId = Number(req.params.id);
    const {status} = req.body;
    if(!status || (status !== 'active' && status !== 'completed')){
        return res.status(400).json({error: 'Missing required field: status is required and must be active or completed only'});
     }
    try{
        const order: Order = await updateOrderStatus(orderId, status);
        res.status(200).json({message: 'Order status updated successfully', order});
    }catch(err: any){ //Error type is unknown, so using any
        res.status(500).json({message: 'Error updating order status',stack: err.stack});
    }
});

ordersRouter.delete('/:id', verifyAuthToken,async (req: Request,res: Response) => {
    const orderId = Number(req.params.id);
    try{
        const order: Order = await deleteOrder(orderId);
        res.status(200).json({message: 'Order deleted successfully', order});
    }catch(err: any){ //Error type is unknown, so using any
        res.status(500).json({message: 'Error deleting order',stack: err.stack});
    }
});

export default ordersRouter;