import postgres from "../database.js";

export type Product = {
    id?: number,
    userId?: number,
    price: string
};

export const getProducts = async (): Promise<Product[]> => {
    try {
        const conn = await postgres.connect();

        const sqlq = "SELECT * FROM products";
        const result = await conn.query(sqlq);
        conn.release();

        return result.rows;
    } catch (err) {
        throw new Error(`Couldn't get products: ${err}`);
    }
}

export const showProduct = async (productId: number): Promise<Product> => {
    try {
        const conn = await postgres.connect();

        const sqlq = "SELECT * FROM products WHERE id=($1)";
        const result = await conn.query(sqlq, [productId]);
        conn.release();

        return result.rows[0];
    } catch (err) {
        throw new Error(`Couldn't find product ${productId}: ${err}`);
    }
}

export const createProduct = async (product: Product): Promise<Product> => {
    try {
        const conn = await postgres.connect();
        const sqlq = "INSERT INTO products (user_id, price) VALUES($1, $2) RETURNING *";
        const result = await conn.query(sqlq, [product.userId, product.price]);
        conn.release();

        return result.rows[0];
    } catch (err) {
        throw new Error(`Couldn't create product ${product.id}: ${err}`);
    }
}

export const getProductsByCategory = async (productCategory: string): Promise<Product[]> => {
    try {
        const conn = await postgres.connect();
        const sqlq = "SELECT * FROM products WHERE category=($1)";
        const result = await conn.query(sqlq, [productCategory]);
        conn.release();

        return result.rows;
    } catch (err) {
        throw new Error(`Couldn't get products in category ${productCategory}: ${err}`);
    }
}

export const getTop5MostPopularProducts = async (): Promise<Product[]> => {
    try {
        const conn = await postgres.connect();
        const sqlq = "SELECT * FROM products WHERE id IN (SELECT product_id FROM products_orders GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 5)";
        const result = await conn.query(sqlq);
        conn.release();

        return result.rows;
    } catch (err) {
        throw new Error(`Couldn't get top 5 products: ${err}`);
    }
}
