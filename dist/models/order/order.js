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
        const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='completed'";
        const result = await conn.query(sql, [userId]);
        conn.release();
        return result.rows;
    }
    catch (err) {
        throw new Error(`Could not get completed orders for user ${userId}. Error: ${err}`);
    }
};
export const createOrder = async (order, product_id, quantity) => {
    try {
        const conn = await postgres.connect();
        const sql1 = "INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *";
        const result1 = await conn.query(sql1, [order.user_id, order.status]);
        conn.release();
        const sql2 = "INSERT INTO products_orders (product_id, order_id, quantity) VALUES($1, $2, $3)";
        await conn.query(sql2, [product_id, result1.rows[0].id, quantity]);
        return result1.rows[0];
    }
    catch (err) {
        throw new Error(`Could not create order for user ${order.user_id}. Error: ${err}`);
    }
};
//# sourceMappingURL=order.js.map