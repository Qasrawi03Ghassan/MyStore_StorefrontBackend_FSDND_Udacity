import { Router } from 'express';
import { deleteOrder, getCompletedOrders, getCurrentOrders, updateOrderStatus } from '../../../models/order/order.js';
import { verifyAuthToken } from '../middleware/mwIndex.js';
import { createFullOrder } from '../../../models/orderService.js';
const ordersRouter = Router();
ordersRouter.get('/', verifyAuthToken, async (req, res) => {
    const user_id = req.userId;
    if (!user_id) {
        return res.status(401).json({ error: "Access denied" });
    }
    try {
        const orders = await getCurrentOrders(Number(user_id));
        res.status(200).json({ message: 'Active orders fetched successfully', orders });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching active orders', stack: err.stack });
    }
});
ordersRouter.get('/completed', verifyAuthToken, async (req, res) => {
    const user_id = req.userId;
    if (!user_id) {
        return res.status(401).json({ error: "Access denied" });
    }
    try {
        const orders = await getCompletedOrders(Number(user_id));
        res.status(200).json({ message: 'Completed orders fetched successfully', orders });
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching completed orders', stack: err.stack });
    }
});
ordersRouter.post('/', verifyAuthToken, async (req, res) => {
    const user_id = req.userId;
    if (!user_id) {
        return res.status(401).json({ error: "Access denied" });
    }
    const products = req.body.products;
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: "Missing or invalid products array" });
    }
    try {
        const order = await createFullOrder(user_id, products);
        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error creating order',
            stack: err.stack
        });
    }
});
ordersRouter.put('/:id', verifyAuthToken, async (req, res) => {
    const orderId = Number(req.params.id);
    const { status } = req.body;
    if (!status || (status !== 'active' && status !== 'completed')) {
        return res.status(400).json({ error: 'Missing required field: status is required and must be active or completed only' });
    }
    try {
        const order = await updateOrderStatus(orderId, status);
        res.status(200).json({ message: 'Order status updated successfully', order });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating order status', stack: err.stack });
    }
});
ordersRouter.delete('/:id', verifyAuthToken, async (req, res) => {
    const orderId = Number(req.params.id);
    try {
        const order = await deleteOrder(orderId);
        res.status(200).json({ message: 'Order deleted successfully', order });
    }
    catch (err) {
        res.status(500).json({ message: 'Error deleting order', stack: err.stack });
    }
});
export default ordersRouter;
//# sourceMappingURL=ordersIndex.js.map