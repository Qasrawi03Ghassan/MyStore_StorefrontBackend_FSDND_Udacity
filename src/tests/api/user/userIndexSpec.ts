import fetch from 'supertest';
import app from '../../../server.js';
import postgres from '../../../models/database.js';
import { User } from '../../../models/user/user.js';

const registerTestUser = async () => {
    const res = await fetch(app.address).post('/api/auth/register').send({ first_name: 'test', last_name: 'user', password: 'password' });
    expect(res.status).toBe(201);
    return res.body.user;
};

const loginTestUser = async () => {
    const res = await fetch(app.address).post('/api/auth/login').send({ first_name: 'test', last_name: 'user', password: 'password' });
    expect(res.status).toBe(200);
    return res.body.token;
};

describe('Users API', () => {

  let token: string;
  let user: User;

beforeEach(async () => {
  const client = await postgres.connect();

  await client.query(`
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
  `);

  client.release();

  user = await registerTestUser();
  token = await loginTestUser();
});

afterEach(async () => {
  const client = await postgres.connect();

  await client.query(`
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
  `);

  client.release();
});

  it('GET /api/users should return 200 status code with list of all users',async()=>{
    const res = await fetch(app.address).get('/api/users').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.users).toBeInstanceOf(Array);
  });
  
  it('GET / api/users/:id should return 200 status code when user is found with found user', async () =>{
    const res = await fetch(app.address).get(`/api/users/${user.id}`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);

    expect(res.body.user.id).toBe(user.id);
    expect(res.body.user.first_name).toBe(user.first_name);
    expect(res.body.user.last_name).toBe(user.last_name);
  });

  it('GET /api/users/:id should return 404 status code when user is not found', async () =>{
    const res = await fetch(app.address).get('/api/users/999999').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('POST /api/users should return 201 status code with the created user and token',async()=>{
    const newUser = {
      first_name:"newName",
      last_name:"User",
      password:"testPass"
    }
    const res = await fetch(app.address).post('/api/users').send(newUser);

    expect(res.status).toBe(201);

    expect(res.body.user.first_name).toBe(newUser.first_name);
    expect(res.body.user.last_name).toBe(newUser.last_name);
    expect(res.body.token).toBeDefined();
  });
});
