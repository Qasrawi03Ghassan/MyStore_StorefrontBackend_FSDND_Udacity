import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config({quiet: true});

const{
    SERVER,
    DB_ENV,
    DB_NAME,
    DB_TEST_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_PORT
} = process.env

let postgres: Pool; //Using let to allow reassignment based on environment variable.
const isTest = DB_ENV === 'test';

if(isTest){
    postgres = new Pool({
    host: SERVER,
    database: DB_TEST_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(DB_PORT) || 5432
    });
}else {
    postgres = new Pool({
    host: SERVER,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(DB_PORT) || 5432
    });
}

export default postgres;

