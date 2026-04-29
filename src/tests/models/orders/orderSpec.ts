import postgres from '../../../models/database.js';
import {Product, createProduct} from '../../../models/product/product.js'
import { Order,getCurrentOrders, getCompletedOrders, createOrder, deleteOrder, updateOrderStatus} from '../../../models/order/order.js';
import { User,createUser } from '../../../models/user/user.js';
import { PoolClient } from 'pg';

const createTestUser = async () => {
    const newUser1: User={
            first_name:"Test1",
            last_name:"User1",
            password_digest:'pw1'
        }
    const user:User = await createUser(newUser1);
    return user;
}

const createTestProductsList = async () : Promise<{product_id:number,quantity:number}[]>=> {
    const newProduct1: Product={
            name:"p1",
            price:10,
            category:"cat1"
    }
    const newProduct2: Product={
            name:"p2",
            price:20,
            category:"cat2"
    }
    const newProduct3: Product={
            name:"p3",
            price:30,
            category:"cat3"
    }

    const p1 : Product = await createProduct(newProduct1);
    const p2 : Product = await createProduct(newProduct2);
    const p3 : Product = await createProduct(newProduct3);

    return [{product_id:p1.id as number,quantity:10},{product_id:p2.id as number,quantity:10},{product_id:p3.id as number,quantity:10}];
}

describe('Orders model', () => {

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

    it('CREATE order',async () => {
        const user = await createTestUser();
        const prods = await createTestProductsList();

        const checkCreation: Order = await createOrder(Number(user.id),prods);
        
        expect(checkCreation).toBeDefined();
        expect(checkCreation.user_id).toBe(1);
        expect(checkCreation.status).toBe('active');
    });

    it('Read active orders',async () => {
        //Creating user and list of products
        const prods = await createTestProductsList();
        const user = await createTestUser();

        await createOrder(Number(user.id),prods);

        const checkRead: Order[] = await getCurrentOrders(Number(user.id));
        expect(checkRead).toBeInstanceOf(Array);

        expect(checkRead[0]?.status).toBe('active');
    });

    it('Read completed orders', async ()=>{
        const prods = await createTestProductsList();
        const user = await createTestUser();

        const checkCreation: Order = await createOrder(Number(user.id),prods);
        
        await updateOrderStatus(Number(checkCreation.id),'completed');

        const checkRead: Order[] = await getCompletedOrders(Number(user.id));
        expect(checkRead).toBeInstanceOf(Array);

        expect(checkRead[0]?.status).toBe('completed');
    }); 

    it('Update an order status by id', async ()=>{
        const prods = await createTestProductsList();
        const user = await createTestUser();

        await createOrder(Number(user.id),prods);
        const checkRead = await updateOrderStatus(1,'completed');

        expect(checkRead.id).toBe(1);
        expect(checkRead.status).toBe('completed');
    }); 

    
    it('Delete an order by id', async ()=>{
        const prods = await createTestProductsList();
        const user = await createTestUser();
        await createOrder(Number(user.id),prods);

        const checkRead = await deleteOrder(1);

        expect(checkRead.id).toBe(1);
    }); 
});
