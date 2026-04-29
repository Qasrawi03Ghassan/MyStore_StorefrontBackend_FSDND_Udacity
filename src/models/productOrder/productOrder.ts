import postgres from "../database.js";

export type ProductOrder = {
    product_id: number,
    order_id: number,
    quantity: number
};

export const getProductsOrders = async () : Promise<ProductOrder[]> => {
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

/*export const createProductOrder = async (productOrder: ProductOrder) : Promise<ProductOrder> => {
    const conn = await postgres.connect();
    let sqlq='';
    let res;

    try{
        if(!productOrder.quantity || productOrder.quantity === null || productOrder.quantity === undefined || Number.isNaN(productOrder.quantity)){
            sqlq = 'INSERT INTO products_orders(product_id,order_id,quantity) VALUES ($1,$2) RETURNING *';
            res = await conn.query(sqlq,[productOrder.product_id,productOrder.order_id]);
        }
        else{
            sqlq = 'INSERT INTO products_orders(product_id,order_id,quantity) VALUES ($1,$2,$3) RETURNING *';
            res = await conn.query(sqlq,[productOrder.product_id,productOrder.order_id,productOrder.quantity]);
        }

        return res.rows[0];
    }catch(err){
        throw new Error(`Couldn't create products_orders item: ${err}`);
    }finally{
        conn.release();
    }
};*/

export const createProductOrder = async (
  productOrder: ProductOrder
): Promise<ProductOrder> => {
  const conn = await postgres.connect();

  try {
    const res = await conn.query(
      `INSERT INTO products_orders (product_id, order_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        productOrder.product_id,
        productOrder.order_id,
        productOrder.quantity ?? 1
      ]
    );

    return res.rows[0];
  } catch (err) {
    throw new Error(`Couldn't create products_orders item: ${err}`);
  } finally {
    conn.release();
  }
};