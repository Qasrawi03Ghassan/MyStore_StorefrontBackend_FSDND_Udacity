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
/*describe('Users API', () => {
    
});*/
//# sourceMappingURL=userIndexSpec.js.map