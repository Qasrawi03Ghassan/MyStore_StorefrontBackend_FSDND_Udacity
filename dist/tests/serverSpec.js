import fetch from 'supertest';
import app from '../server.js';
describe('Endpoint GET /', () => {
    it('Should return 301 status code', async () => {
        await fetch(app.address)
            .get('/')
            .expect(301);
    });
    it('Should redirect to /api', async () => {
        await fetch(app.address)
            .get('/')
            .expect('Location', '/api');
    });
});
//# sourceMappingURL=serverSpec.js.map