import fetch from 'supertest';
import app from '../../../server.js';
import postgres from '../../../models/database.js';
const cleanupTestUser = async () => {
    const client = await postgres.connect();
    try {
        await client.query('DELETE FROM users WHERE first_name = $1 AND last_name = $2', ['test', 'user']);
    }
    catch (err) {
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
/*describe('Orders API', () => {
 
});*/
//# sourceMappingURL=orderIndexSpec.js.map