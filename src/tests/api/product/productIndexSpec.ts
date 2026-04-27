import fetch from 'supertest';
import app from '../../../server.js';
import postgres from '../../../models/database.js';

const cleanupTest = async () => {
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

describe('Products API', () => {
    it('GET /api/products should return 200 status code with a list of products',async() => {
        const res = await fetch(app.address).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.body.products).toBeInstanceOf(Array);
    });

    it('POST /api/products should return 201 status code with the created product',async() => {
        const newProduct = {
            name: 'Test Product',
            price: 9.99,
            category: 'Test Category'
        };
        const res = await fetch(app.address).post('/api/products').send(newProduct);
        expect(res.status).toBe(201);
        expect(res.body.name).toBe(newProduct.name);
        expect(res.body.price).toBe(newProduct.price);
        expect(res.body.category).toBe(newProduct.category);

        await cleanupTest();
    });
    

});