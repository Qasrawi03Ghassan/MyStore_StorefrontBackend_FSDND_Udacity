import { PoolClient } from "pg";
import postgres from "../../../models/database.js";
import { createProductOrder, getProductsOrders, ProductOrder } from "../../../models/productOrder/productOrder.js";
import { createTestProductsList, createTestUser } from "../orders/orderSpec.js";
import { createOrder } from "../../../models/order/order.js";

describe('Products_Orders Model',() => {
    
    let client:PoolClient;
    beforeAll(async () => {
        client = await postgres.connect();
        await client.query(`
        TRUNCATE TABLE users,products,orders RESTART IDENTITY CASCADE;
    `);
    });

    afterAll(async () => {
        await client.query(`
        TRUNCATE TABLE users,products,orders RESTART IDENTITY CASCADE;
    `);
        client.release();
    });

    it('Read all Products_orders', async () => {
        const checkRead = await getProductsOrders();

        expect(checkRead).toBeInstanceOf(Array);

    });

    it('CREATE Product_Order', async () => {
        const user = await createTestUser();
        const product = await createTestProductsList();
        const order = await createOrder(user.id!); // simple order, no products

        const newProductOrder: ProductOrder = {
            product_id: product[0]!.product_id,
            order_id: order.id!,
            quantity: 5
        };

        const checkCreation = await createProductOrder(newProductOrder);

        expect(checkCreation).toBeDefined();
        expect(checkCreation.product_id).toBe(product[0]!.product_id);
        expect(checkCreation.order_id).toBe(order.id);
        expect(checkCreation.quantity).toBe(5);
        });
    
        it('Read Products_Orders items',async () => {
            
        });
});
