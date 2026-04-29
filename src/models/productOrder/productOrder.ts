import postgres from "../database.js";

export type ProductOrder = {
    product_id?: number,
    order_id?: string,
    quantity: number
};

export const getProductsOrders = async () => {
    const conn = await postgres.connect();
    try{
        const sqlq = 'SELECT * FROM products_orders';
        const res = await conn.query(sqlq);

        return res.rows;
    }catch(err){
        throw new Error(`Couldn't get products_orders items: ${err}`);
    }finally{
        conn.release();
    }
};