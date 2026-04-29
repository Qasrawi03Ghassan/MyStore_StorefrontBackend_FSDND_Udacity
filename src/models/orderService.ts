// services/orderService.ts

import { createOrder } from '../models/order/order.js';
import { createProductOrder } from '../models/productOrder/productOrder.js';

export const createFullOrder = async (
  user_id: number,
  products: { product_id: number; quantity: number }[]
) => {
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