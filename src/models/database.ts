import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

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

if(DB_ENV === 'test'){
    postgres = new Pool({
    host: SERVER,
    database: DB_TEST_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(DB_PORT) || 5432
    });
}else if(DB_ENV === 'dev'){
    postgres = new Pool({
    host: SERVER,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
    port: Number(DB_PORT) || 5432
    });
}else{
    throw new Error('Invalid database environment, must use "test" or "dev" only!');
}

export default postgres;

