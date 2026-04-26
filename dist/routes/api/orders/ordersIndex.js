import { Router } from 'express';
import { getCompletedOrders, getCurrentOrders } from '../../../models/order/order.js';
const ordersRouter = Router();
//TODO: add jwt
ordersRouter.get('/', async (req, res) => {
    try {
        const orders = await getCurrentOrders(req.body.user_id);
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching active orders', stack: err.stack });
    }
});
//TODO: add jwt
ordersRouter.get('/completed', async (req, res) => {
    try {
        const orders = await getCompletedOrders(req.body.user_id);
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching completed orders', stack: err.stack });
    }
});
export default ordersRouter;
//# sourceMappingURL=ordersIndex.js.map