import fetch from 'supertest'
import app from '../../server.js';

describe('GET /api', () => {
  it('Should return 200 status code', async () => {
    await fetch(app.address)
    .get('/api').expect(200);
  });

  it('Should return \"Server is up\" message', async () => {
    await fetch(app.address)
    .get('/api')
    .expect('Server is up');
  });
});