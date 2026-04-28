import fetch from 'supertest';
import app from '../../../server.js';
import postgres from '../../../models/database.js';
describe('Auth API', () => {
    beforeEach(async () => {
        process.env.DB_ENV = 'test';
        const client = await postgres.connect();
        await client.query(`
      TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `);
        client.release();
        await fetch(app.address).post('/api/auth/register').send({
            first_name: 'test',
            last_name: 'user',
            password: 'testpassword123'
        });
    });
    afterEach(async () => {
        const client = await postgres.connect();
        await client.query(`
      TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `);
        client.release();
    });
    it('GET /api/auth should return 200 status code with message "auth is up"', async () => {
        const res = await fetch(app.address).get('/api/auth');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'auth is up' });
    });
    describe('Auth API Valid credentials', () => {
        it('POST /api/auth/register should register/create a new user', async () => {
            const res = await fetch(app.address)
                .post('/api/auth/register')
                .send({
                first_name: 'new',
                last_name: 'user',
                password: 'testpassword123'
            });
            expect(res.status).toBe(201);
        });
        it('POST /api/auth/login should return 200 status code and token', async () => {
            const res = await fetch(app.address)
                .post('/api/auth/login')
                .send({
                first_name: 'test',
                last_name: 'user',
                password: 'testpassword123'
            });
            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
        });
    });
    describe('Auth API Invalid credentials', () => {
        it('POST /api/auth/register should return 400 for invalid payload', async () => {
            const res = await fetch(app.address)
                .post('/api/auth/register')
                .send({
                first_name: 'test',
                password: 'testpassword123'
            });
            expect(res.status).toBe(400);
        });
        it('POST /api/auth/login should return 401 for wrong password', async () => {
            const res = await fetch(app.address)
                .post('/api/auth/login')
                .send({
                first_name: 'test',
                last_name: 'user',
                password: 'wrongpassword'
            });
            expect(res.status).toBe(401);
            expect(res.body.token).toBeUndefined();
        });
    });
});
//# sourceMappingURL=authIndexSpec.js.map