import postgres from "../database.js";

export type User = {
    id?: number,
    firstName: string,
    lastName: string,
    passwordHash: string
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const conn = await postgres.connect();
        const sql = "SELECT * FROM users";
        const result = await conn.query(sql);
        conn.release();

        return result.rows;
    } catch (err) {
        throw new Error(`Couldn't get users: ${err}`);
    }
}

export const showUserById = async (userId: number): Promise<User> => {
    try {
        const conn = await postgres.connect();
        const sql = "SELECT * FROM users WHERE id=($1)";
        const result = await conn.query(sql, [userId]);
        conn.release();
        
        return result.rows[0];
    } catch (err) {
        throw new Error(`Couldn't find user with ID ${userId}: ${err}`);
    }
}

export const showUserByFirstNameAndLastName = async (firstName: string, lastName: string): Promise<User> => {
    try {
        const conn = await postgres.connect();
        const sql = "SELECT * FROM users WHERE first_name=($1) AND last_name=($2)";
        const result = await conn.query(sql, [firstName, lastName]);
        conn.release();
        
        return result.rows[0];
    } catch (err) {
        throw new Error(`Couldn't find user with name ${firstName} ${lastName}: ${err}`);
    }
}

export const createUser = async (user: User): Promise<User> => {
    try {
        const conn = await postgres.connect();
        const sql = "INSERT INTO users (first_name, last_name, password_digest) VALUES($1, $2, $3) RETURNING *";
        const result = await conn.query(sql, [user.firstName, user.lastName, user.passwordHash]);
        conn.release();

        return result.rows[0];
    } catch (err) {
        throw new Error(`Couldn't create user: ${err}`);
    }
}