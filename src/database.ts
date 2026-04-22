import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const{
    SERVER,
    DB_ENV,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_PORT,
    DB_TEST_NAME,
    DB_TEST_PORT
} = process.env

const database = DB_ENV === 'DEV'? DB_NAME : DB_TEST_NAME;
const port = DB_ENV === 'DEV'? DB_PORT : DB_TEST_PORT;

const postgres = new Pool({
    host: SERVER,
    database: database,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(port)
});


export default postgres;

