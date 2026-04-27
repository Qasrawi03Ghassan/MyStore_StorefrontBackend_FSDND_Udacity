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
export const updateOrderStatus = async (orderId, status) => {
    try {
        const conn = await postgres.connect();
        const sql = "UPDATE orders SET status=($1) WHERE id=($2) RETURNING *";
        const result = await conn.query(sql, [status, orderId]);
        conn.release();
        return result.rows[0];
    }
    catch (err) {
        throw new Error(`Could not update order ${orderId} status to ${status}. Error: ${err}`);
    }
};
export const deleteOrder = async (orderId) => {
    const conn = await postgres.connect();
    try {
        await conn.query("BEGIN");
        await conn.query("DELETE FROM products_orders WHERE order_id=($1)", [orderId]);
        const sql = "DELETE FROM orders WHERE id=($1) RETURNING *";
        const result = await conn.query(sql, [orderId]);
        await conn.query("COMMIT");
        return result.rows[0];
    }
    catch (err) {
        await conn.query("ROLLBACK");
        throw new Error(`Could not delete order ${orderId}. Error: ${err}`);
    }
    finally {
        conn.release();
    }
};
//# sourceMappingURL=order.js.map