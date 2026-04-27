import postgres from "../database.js";
export const getProducts = async () => {
    try {
        const conn = await postgres.connect();
        const sqlq = "SELECT * FROM products";
        const result = await conn.query(sqlq);
        conn.release();
        return result.rows;
    }
    catch (err) {
        throw new Error(`Couldn't get products: ${err}`);
    }
};
export const showProduct = async (productId) => {
    try {
        const conn = await postgres.connect();
        const sqlq = "SELECT * FROM products WHERE id=($1)";
        const result = await conn.query(sqlq, [productId]);
        conn.release();
        return result.rows[0];
    }
    catch (err) {
        throw new Error(`Couldn't find product ${productId}: ${err}`);
    }
};
export const createProduct = async (product) => {
    try {
        const conn = await postgres.connect();
        const sqlq = "INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *";
        const result = await conn.query(sqlq, [product.name, product.price, product.category]);
        conn.release();
        return result.rows[0];
    }
    catch (err) {
        throw new Error(`Couldn't create product ${product.id}: ${err}`);
    }
};
export const getProductsByCategory = async (productCategory) => {
    try {
        const conn = await postgres.connect();
        const sqlq = "SELECT * FROM products WHERE category=($1)";
        const result = await conn.query(sqlq, [productCategory]);
        conn.release();
        return result.rows;
    }
    catch (err) {
        throw new Error(`Couldn't get products in category ${productCategory}: ${err}`);
    }
};
export const getTop5MostPopularProducts = async () => {
    try {
        const conn = await postgres.connect();
        const sqlq = "SELECT * FROM products WHERE id IN (SELECT product_id FROM products_orders GROUP BY product_id ORDER BY SUM(quantity) DESC LIMIT 5)";
        const result = await conn.query(sqlq);
        conn.release();
        return result.rows;
    }
    catch (err) {
        throw new Error(`Couldn't get top 5 products: ${err}`);
    }
};
export const updateProduct = async (product) => {
    try {
        const conn = await postgres.connect();
        let sqlq = '';
        if (product.category === null || product.category === undefined) {
            sqlq = "UPDATE products SET name=($1), price=($2) WHERE id=($3) RETURNING *";
        }
        else {
            sqlq = "UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *";
        }
        const result = await conn.query(sqlq, [product.name, product.price, product.category, product.id]);
        conn.release();
        return result.rows[0];
    }
    catch (err) {
        throw new Error(`Couldn't update product ${product.id}: ${err}`);
    }
};
export const deleteProduct = async (productId) => {
    const conn = await postgres.connect();
    try {
        await conn.query("BEGIN");
        await conn.query("DELETE FROM products_orders WHERE product_id=($1)", [productId]);
        const sql = "DELETE FROM products WHERE id=($1) RETURNING *";
        const result = await conn.query(sql, [productId]);
        await conn.query("COMMIT");
        return result.rows[0];
    }
    catch (err) {
        await conn.query("ROLLBACK");
        throw new Error(`Couldn't delete product ${productId}: ${err}`);
    }
    finally {
        conn.release();
    }
};
//# sourceMappingURL=product.js.map