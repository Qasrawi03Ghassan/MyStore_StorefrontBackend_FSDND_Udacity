export {};
/*import fetch from 'supertest';
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

describe('Orders API', () => {

    

});*/
//# sourceMappingURL=orderIndexSpec.js.map