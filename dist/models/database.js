import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });
const { SERVER, DB_ENV, DB_NAME, DB_TEST_NAME, DB_USER, DB_PASSWORD, DB_PORT } = process.env;
const isTest = process.env.NODE_ENV === 'test';
const postgres = new Pool({
    host: SERVER,
    database: isTest ? DB_TEST_NAME : DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(DB_PORT) || 5432
});
export default postgres;
//# sourceMappingURL=database.js.map