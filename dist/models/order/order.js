import postgres from "../database.js";
export const getCurrentOrders = async (userId) => {
    try {
        const conn = await postgres.connect();
        const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='active'";
        const result = await conn.query(sql, [userId]);
        conn.release();
        return result.rows;
    }
    catch (err) {
        throw new Error(`Could not get current order for user ${userId}. Error: ${err}`);
    }
};
export const getCompletedOrders = async (userId) => {
    try {
        const conn = await postgres.connect();
        const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='complete'";
        const result = await conn.query(sql, [userId]);
        conn.release();
        return result.rows;
    }
    catch (err) {
        throw new Error(`Could not get completed orders for user ${userId}. Error: ${err}`);
    }
};
//# sourceMappingURL=order.js.map