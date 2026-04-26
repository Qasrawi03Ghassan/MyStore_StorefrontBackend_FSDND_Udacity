import postgres from "../database.js";

export type Order   = {
    id?: number,
    user_id?: number,
    status: string
};

export const getCurrentOrders = async (userId: number): Promise<Order[]> => {
    try {
        const conn = await postgres.connect();
        const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='active'";
        const result = await conn.query(sql, [userId]);
        conn.release();

        return result.rows;
    } catch (err) {
        throw new Error(`Could not get current order for user ${userId}. Error: ${err}`);
    }
};

export const getCompletedOrders = async (userId: number): Promise<Order[]> => {
    try {
        const conn = await postgres.connect();
        const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='complete'";
        const result = await conn.query(sql, [userId]);
        conn.release();

        return result.rows;
    }catch(err) {
        throw new Error(`Could not get completed orders for user ${userId}. Error: ${err}`);
    }
};
