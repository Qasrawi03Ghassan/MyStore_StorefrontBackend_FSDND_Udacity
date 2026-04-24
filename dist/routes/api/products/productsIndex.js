import { Router } from 'express';
import { getProducts, showProduct, getTop5MostPopularProducts, getProductsByCategory } from '../../../models/product/product.js';
const productsRouter = Router();
productsRouter.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        res.status(200).json({ products });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch products', stack: err.stack });
    }
});
productsRouter.get('/:id', async (req, res) => {
    const productId = Number(req.params.id);
    if (isNaN(productId)) {
        res.status(301).redirect('/api/products/:category');
    }
    try {
        const product = await showProduct(productId);
        res.status(200).json({ product });
    }
    catch (err) {
        res.status(500).json({ error: `Failed to fetch product ${productId}`, stack: err.stack });
    }
});
productsRouter.get('/most-popular', async (req, res) => {
    try {
        const products = await getTop5MostPopularProducts();
        res.status(200).json({ products });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch most popular products', stack: err.stack });
    }
});
productsRouter.get('/:category', async (req, res) => {
    const productCategory = String(req.params.category);
    try {
        const products = await getProductsByCategory(productCategory);
        res.status(200).json({ products });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch products by category', stack: err.stack });
    }
});
export default productsRouter;
//# sourceMappingURL=productsIndex.js.map