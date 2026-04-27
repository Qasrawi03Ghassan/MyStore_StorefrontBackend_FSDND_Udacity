import fetch from 'supertest';
import app from '../../../server.js';
import postgres from '../../../models/database.js';

const cleanupTestUser = async () => {
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

describe('Auth API', () => {

    it('GET /api/auth should return 200 status code with message "auth is up"',async() => {
        const res = await fetch(app.address).get('/api/auth');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'auth is up' });
    });

    describe('Auth API Valid credentials', () => {
    
        it('POST /api/auth/register should register/create a new user', async () => {
            const res = await fetch(app.address).post('/api/auth/register')
            .send({
                first_name: 'test',
                last_name: 'user',
                password: 'testpassword123'
            });
            expect(res.status).toBe(201);

            await cleanupTestUser();
        });

        it('POST /api/auth/login should return 200 status code when valid credentials are provided and return a token', async () => {
                await fetch(app.address).post('/api/auth/register')
                .send({
                    first_name: 'test',
                    last_name: 'user',
                    password: 'testpassword123'
                });

                const res = await fetch(app.address).post('/api/auth/login')
                .send({
                    first_name: 'test',
                    last_name: 'user',
                    password: 'testpassword123'
                });
                
                expect(res.status).toBe(200);
                expect(res.body.token).toBeDefined();

                await cleanupTestUser();
            });
    });

    describe('Auth API Invalid credentials', () => {
    
        it('POST /api/auth/register should NOT register/create a new user and return a 400 status code', async () => {
            const res = await fetch(app.address).post('/api/auth/register')
            .send({
                first_name: 'test',
                password: 'testpassword123'
            });
            expect(res.status).toBe(400);

            await cleanupTestUser();
        });

    it('POST /api/auth/login should return 401 status code when invalid credentials are provided', async () => {
    
    await fetch(app.address).post('/api/auth/register')
      .send({
        first_name: 'test',
        last_name: 'user',
        password: 'testpassword123'
      });

    
        const res = await fetch(app.address).post('/api/auth/login')
        .send({
            first_name: 'test',
            last_name: 'user',
            password: 'wrongpassword'
        });
        
        expect(res.status).toBe(401);
        expect(res.body.token).toBeUndefined();

        await cleanupTestUser();
        });

    });

});
