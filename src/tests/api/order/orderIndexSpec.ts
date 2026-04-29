import fetch from 'supertest';
import app from '../../../server.js';
import postgres from '../../../models/database.js';
import { Order } from '../../../models/order/order.js';
import { Product } from '../../../models/product/product.js';
import { PoolClient } from 'pg';

const registerTestUser = async () => {
    const res = await fetch(app.address).post('/api/auth/register').send({ first_name: 'test', last_name: 'user', password: 'password' });
    expect(res.status).toBe(201);
};

const loginTestUser = async () => {
    const res = await fetch(app.address).post('/api/auth/login').send({ first_name: 'test', last_name: 'user', password: 'password' });
    expect(res.status).toBe(200);
    return res.body.token;
};

const createTestOrder = async (token: string,products: any[]) => {//Used any here to pass list of products in order to extract product_id nad quantity for each one
    const newOrder = {
      products: products.map((p) => ({
      product_id: p.id,
      quantity: 10
    }))
  };
    const res = await fetch(app.address).post('/api/orders').set('Authorization', `Bearer ${token}`).send(newOrder);
    expect(res.status).toBe(201);

    return res.body.order;
};

const createTestProduct = async (token: string) => {
    const newProduct = {
        name: 'Test Product',
        price: 20,
        category: 'Test Category'
    };
    const res = await fetch(app.address).post('/api/products').set('Authorization', `Bearer ${token}`).send(newProduct);
    expect(res.status).toBe(201);
    return res.body.product;
};


describe('Orders API', () => {

  let token: string;
  let createdProducts: Product[] = [];
  let createdOrder: Order;

  let client:PoolClient;

  beforeAll(async () => {
    client = await postgres.connect();
    await client.query(`
      TRUNCATE TABLE orders, products, users RESTART IDENTITY CASCADE;
    `);

    //client.release();

    await registerTestUser();
    token = await loginTestUser();

    for(let i=0;i<5;i++){
      createdProducts[i] = await createTestProduct(token);
    }

    createdOrder = await createTestOrder(token,createdProducts);
  });

  afterAll(async () => {
    //const client = await postgres.connect();

    await client.query(`
      TRUNCATE TABLE orders, products, users RESTART IDENTITY CASCADE;
    `);

    client.release();
  });

  it('GET /api/orders should return 200 status code along with active orders for the current user', async ()=>{
    const res = await fetch(app.address).get('/api/orders').set('Authorization',`Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.orders).toBeInstanceOf(Array);
  });

  it('GET /api/orders/completed should return 200 status code along with completed orders for the current user', async ()=>{
    await fetch(app.address).put(`/api/orders/${createdOrder.id}`).set('Authorization',`Bearer ${token}`).send({status:"completed"});

    const res = await fetch(app.address).get('/api/orders/completed').set('Authorization',`Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.orders).toBeInstanceOf(Array);
    expect(res.body.orders[0].status).toBe('completed');
  });

  it('PUT /api/orders/:id should return 200 status code along with updated order for the current user', async ()=>{
    const res = await fetch(app.address).put(`/api/orders/${createdOrder.id}`).set('Authorization',`Bearer ${token}`).send({status:"completed"});
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Order status updated successfully');
  });

  it('DEL /api/orders:/id should return 200 status code with the deleted order for the current user', async () =>{
    const res = await fetch(app.address).delete(`/api/orders/${createdOrder.id}`).set('Authorization',`Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Order deleted successfully');
  });

});
