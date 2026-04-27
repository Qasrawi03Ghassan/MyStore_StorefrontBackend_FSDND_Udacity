import fetch from 'supertest';
import app from '../../../server.js';
import postgres from '../../../models/database.js';

const cleanupTestProducts = async () => {
  const client = await postgres.connect();
    try {
      await client.query('DELETE FROM products WHERE name = $1', ['Test Product']);
    } catch (err) {
      console.error('Error cleaning up test product:', err);
    }
    finally {  
        client.release();
    }
};

const cleanUpTestUser = async () => {
    const client = await postgres.connect();
    try {
      await client.query('DELETE FROM users WHERE first_name = $1 AND last_name = $2', ['test', 'user']);
    } catch (err) {
      console.error('Error cleaning up test user:', err);
    }
    finally {
        client.release();
    }
};

describe('Products API', () => {
    it('GET /api/products should return 200 status code with a list of products',async() => {
        const res = await fetch(app.address).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.body.products).toBeInstanceOf(Array);
    });

    it('POST /api/products should return 201 status code with the created product',async() => {
        const createUserRes = await fetch(app.address).post('/api/auth/register').send({ first_name: 'test', last_name: 'user', password: 'password' });
        expect(createUserRes.status).toBe(201);

        const loginRes = await fetch(app.address).post('/api/auth/login').send({ first_name: 'test', last_name: 'user', password: 'password' });
        expect(loginRes.status).toBe(200);

        const token = loginRes.body.token;
        const newProduct = {
            name: 'Test Product',
            price: 20,
            category: 'Test Category'
        };
        const res = await fetch(app.address).post('/api/products').set('Authorization', `Bearer ${token}`).send(newProduct);
        
        expect(res.status).toBe(201);

        expect(res.body.product.name).toBe(newProduct.name);
        expect(res.body.product.price).toBe(newProduct.price);
        expect(res.body.product.category).toBe(newProduct.category);

        await cleanupTestProducts();
        await cleanUpTestUser();
    });
    

});