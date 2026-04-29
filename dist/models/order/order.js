import postgres from "../database.js";
export const getCurrentOrders = async (userId) => {
    try {
        const conn = await postgres.connect();
        const sql = `
            SELECT 
                o.id,
                o.user_id,
                o.status,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'product_id', po.product_id,
                        'quantity', po.quantity
                    )
                ) AS products
            FROM orders o
            JOIN products_orders po 
                ON o.id = po.order_id
            WHERE o.user_id = $1
              AND o.status = 'active'
            GROUP BY o.id
            ORDER BY o.id;
        `;
        const result = await conn.query(sql, [userId]);
        conn.release();
        return result.rows;
    }
    catch (err) {
        throw new Error(`Could not get current orders for user ${userId}. Error: ${err}`);
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
export const createOrder = async (user_id, products) => {
    const conn = await postgres.connect();
    try {
        await conn.query('BEGIN');
        const orderResult = await conn.query("INSERT INTO orders (user_id, status) VALUES ($1, 'active') RETURNING *", [user_id]);
        const order = orderResult.rows[0];
        for (const item of products) {
            await conn.query(`INSERT INTO products_orders (order_id, product_id, quantity)
         VALUES ($1, $2, $3)`, [
                order.id,
                item.product_id,
                item.quantity ?? 1
            ]);
        }
        await conn.query('COMMIT');
        return order;
    }
    catch (err) {
        await conn.query('ROLLBACK');
        throw new Error(`Could not create order for user ${user_id}. Error: ${err}`);
    }
    finally {
        conn.release();
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