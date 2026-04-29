import postgres from "../database.js";
export const getProductsOrders = async () => {
    const conn = await postgres.connect();
    try {
        const sqlq = 'SELECT * FROM products_orders';
        const res = await conn.query(sqlq);
        return res.rows;
    }
    catch (err) {
        throw new Error(`Couldn't get products_orders items: ${err}`);
    }
    finally {
        conn.release();
    }
};
//# sourceMappingURL=productOrder.js.map