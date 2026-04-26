import { Router } from 'express';
import { createOrder, getCompletedOrders, getCurrentOrders } from '../../../models/order/order.js';
const ordersRouter = Router();
//TODO: add jwt
ordersRouter.get('/', async (req, res) => {
    try {
        const orders = await getCurrentOrders(req.body.user_id);
        res.status(200).json(orders);
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ message: 'Error fetching active orders', stack: err.stack });
    }
});
//TODO: add jwt
ordersRouter.get('/completed', async (req, res) => {
    try {
        const orders = await getCompletedOrders(req.body.user_id);
        res.status(200).json(orders);
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ message: 'Error fetching completed orders', stack: err.stack });
    }
});
//TODO: add jwt
ordersRouter.post('/', async (req, res) => {
    try {
        const order = await createOrder(req.body, req.body.product_id, req.body.quantity);
        res.status(200).json({ order });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ message: 'Error creating order', stack: err.stack });
    }
});
export default ordersRouter;
//# sourceMappingURL=ordersIndex.js.map