import postgres from '../../../models/database.js';
import { User,getUsers, createUser, showUserById} from '../../../models/user/user.js';
import bcrypt from 'bcrypt';

const createTestUsersList = async () =>{
    const newUser1={
            first_name:"Test1",
            last_name:"User1",
            password_digest:'pw1'
        }
        const newUser2={
            first_name:"Test2",
            last_name:"User2",
            password_digest:'pw2'
        }
        const newUser3={
            first_name:"Test3",
            last_name:"User3",
            password_digest:'pw3'
        }

        await createUser(newUser1);
        await createUser(newUser2);
        await createUser(newUser3);
}

describe('User model CRUDs', () => {


    beforeEach(async () => {
    const client = await postgres.connect();
    await client.query(`
        TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `);
    client.release();
    });

    afterEach(async () => {
    const client = await postgres.connect();
    await client.query(`
        TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    `);
    client.release();
    });

    it('CREATE user',async () => {
        const pwDigest: string = await bcrypt.hash('TestPassword' + process.env.PEPPER, Number.parseInt(process.env.SALT_ROUNDS || '10'));;
        const newUser = {
            first_name:"Test",
            last_name:"User",
            password_digest:pwDigest
        }
        const checkCreation: User = await createUser(newUser);
        
        expect(checkCreation).toBeDefined();
        expect(checkCreation.first_name).toBe("Test");
        expect(checkCreation.last_name).toBe("User");
        expect(checkCreation.password_digest).toBe(pwDigest);
    });

    it('Read users',async () => {
        //Creating list of users
        await createTestUsersList();

        const checkRead: User[] = await getUsers();
        expect(checkRead).toBeInstanceOf(Array);

        expect(checkRead[1]?.first_name).toBe('Test2');
        expect(checkRead[1]?.last_name).toBe('User2');
        expect(checkRead[1]?.password_digest).toBe('pw2');
    });

    it('Read a user by id', async ()=>{
        await createTestUsersList();

        const checkRead = await showUserById(3);

        expect(checkRead.id).toBe(3);
        expect(checkRead.first_name).toBe('Test3');
        expect(checkRead.last_name).toBe('User3');
        expect(checkRead.password_digest).toBe('pw3');
    });
 
});
