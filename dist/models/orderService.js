// services/orderService.ts
import { createOrder } from '../models/order/order.js';
import { createProductOrder } from '../models/productOrder/productOrder.js';
export const createFullOrder = async (user_id, products) => {
    const order = await createOrder(user_id);
    for (const item of products) {
        await createProductOrder({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity
        });
    }
    return order;
};
//# sourceMappingURL=orderService.js.map