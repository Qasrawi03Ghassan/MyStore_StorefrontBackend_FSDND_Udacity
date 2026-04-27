import fetch from 'supertest';
import app from '../../../server.js';
import postgres from '../../../models/database.js';
import { Product } from '../../../models/product/product.js';

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

const registerTestUser = async () => {
    const res = await fetch(app.address).post('/api/auth/register').send({ first_name: 'test', last_name: 'user', password: 'password' });
    expect(res.status).toBe(201);
};

const loginTestUser = async () => {
    const res = await fetch(app.address).post('/api/auth/login').send({ first_name: 'test', last_name: 'user', password: 'password' });
    expect(res.status).toBe(200);
    return res.body.token;
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

describe('Products API', () => {
  let token: string;
  let createdProduct: Product;
  beforeAll(async () => {
    await registerTestUser();
    token = await loginTestUser();
    createdProduct = await createTestProduct(token);
  });

  afterAll(async () => {
    await cleanupTestProducts();
    await cleanUpTestUser();
  });

    it('GET /api/products should return 200 status code with a list of products',async() => {
        const res = await fetch(app.address).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.body.products).toBeInstanceOf(Array);
    });

    it('GET /api/products/:id should return 200 status code with the specified product',async() => {
        const res = await fetch(app.address).get(`/api/products/${createdProduct.id}`)
        expect(res.status).toBe(200);
        expect(res.body.product.id).toBe(createdProduct.id);
    });

    it('POST /api/products should return 201 status code with the created product',async() => {
        const newProduct = {
            name: 'Test Product',
            price: 20,
            category: 'TestCat'
        };
        const res = await fetch(app.address).post('/api/products').set('Authorization', `Bearer ${token}`).send(newProduct);
        
        expect(res.status).toBe(201);

        expect(res.body.product.name).toBe(newProduct.name);
        expect(res.body.product.price).toBe(newProduct.price);
        expect(res.body.product.category).toBe(newProduct.category);
    });

    it('POST /api/products without token should return 401 status code',async() => {
        const newProduct = {
            name: 'Test Product',
            price: 20,
            category: 'Test Category'
        };
        const res = await fetch(app.address).post('/api/products').send(newProduct);
        expect(res.status).toBe(401);
      });

      it('GET /api/products/most-popular should return 200 status code with list of top 5 products',async ()=>{
        const res = await fetch(app.address).get('/api/products/most-popular');
        const resListLength = res.body.products.length;
        expect(res.status).toBe(200);
        expect(res.body.products).toBeInstanceOf(Array);
        expect(resListLength).toBeLessThanOrEqual(5);
      });

      it('GET /api/products/get-by-cat?cat=:cat should return 200 status code with list of products of category :cat',async ()=>{
        const res = await fetch(app.address).get(`/api/products/get-by-cat?cat=${createdProduct.category}`);
        expect(res.status).toBe(200);

        const products = res.body.products;
        expect(products).toBeInstanceOf(Array);
        
        for(const product of products){
          expect(product.category).toBe(createdProduct.category);
        }
      });

      it('PUT /api/products/:id should return 200 status code and change requested product && DEL /api/products/:id should return 200 status code and deleted product', async ()=>{
        const updatedProduct = {
          name:"updated Test Product",
          price:99,
          category:"updatedCat"
        }
        const res = await fetch(app.address).put(`/api/products/${createdProduct.id}`).set('Authorization', `Bearer ${token}`).send(updatedProduct);
        expect(res.status).toBe(200);
        expect(res.body.product.id).toBe(createdProduct.id);
        expect(res.body.product.name).toBe('updated Test Product');

        const res2 = await fetch(app.address)
      .delete(`/api/products/${createdProduct.id}`)
      .set('Authorization', `Bearer ${token}`);

      expect(res2.status).toBe(200);
      expect(res2.body.product.id).toBe(createdProduct.id);
      });
});