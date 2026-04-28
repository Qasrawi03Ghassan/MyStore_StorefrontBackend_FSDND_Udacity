import postgres from '../../../models/database.js';
import { createProduct } from '../../../models/product/product.js';
import { getCurrentOrders, getCompletedOrders, createOrder, deleteOrder, updateOrderStatus } from '../../../models/order/order.js';
import { createUser } from '../../../models/user/user.js';
const createTestUser = async () => {
    const newUser1 = {
        first_name: "Test1",
        last_name: "User1",
        password_digest: 'pw1'
    };
    const user = await createUser(newUser1);
    return user;
};
const createTestProductsList = async () => {
    const newProduct1 = {
        name: "p1",
        price: 10,
        category: "cat1"
    };
    const newProduct2 = {
        name: "p2",
        price: 20,
        category: "cat2"
    };
    const newProduct3 = {
        name: "p3",
        price: 30,
        category: "cat3"
    };
    const p1 = await createProduct(newProduct1);
    const p2 = await createProduct(newProduct2);
    const p3 = await createProduct(newProduct3);
    return [{ product_id: p1.id, quantity: 10 }, { product_id: p2.id, quantity: 10 }, { product_id: p3.id, quantity: 10 }];
};
describe('Orders model', () => {
    beforeEach(async () => {
        const client = await postgres.connect();
        await client.query(`
        TRUNCATE TABLE users,products,orders RESTART IDENTITY CASCADE;
    `);
        client.release();
    });
    afterEach(async () => {
        const client = await postgres.connect();
        await client.query(`
        TRUNCATE TABLE users,products,orders RESTART IDENTITY CASCADE;
    `);
        client.release();
    });
    it('CREATE order', async () => {
        const user = await createTestUser();
        const prods = await createTestProductsList();
        const checkCreation = await createOrder(Number(user.id), prods);
        expect(checkCreation).toBeDefined();
        expect(checkCreation.user_id).toBe(1);
        expect(checkCreation.status).toBe('active');
    });
    it('Read active orders', async () => {
        //Creating user and list of products
        const prods = await createTestProductsList();
        const user = await createTestUser();
        await createOrder(Number(user.id), prods);
        const checkRead = await getCurrentOrders(Number(user.id));
        expect(checkRead).toBeInstanceOf(Array);
        expect(checkRead[0]?.status).toBe('active');
    });
    it('Read completed orders', async () => {
        const prods = await createTestProductsList();
        const user = await createTestUser();
        const checkCreation = await createOrder(Number(user.id), prods);
        await updateOrderStatus(Number(checkCreation.id), 'completed');
        const checkRead = await getCompletedOrders(Number(user.id));
        expect(checkRead).toBeInstanceOf(Array);
        expect(checkRead[0]?.status).toBe('completed');
    });
    it('Update an order status by id', async () => {
        const prods = await createTestProductsList();
        const user = await createTestUser();
        await createOrder(Number(user.id), prods);
        const checkRead = await updateOrderStatus(1, 'completed');
        expect(checkRead.id).toBe(1);
        expect(checkRead.status).toBe('completed');
    });
    it('Delete an order by id', async () => {
        const prods = await createTestProductsList();
        const user = await createTestUser();
        await createOrder(Number(user.id), prods);
        const checkRead = await deleteOrder(1);
        expect(checkRead.id).toBe(1);
    });
});
//# sourceMappingURL=orderSpec.js.map