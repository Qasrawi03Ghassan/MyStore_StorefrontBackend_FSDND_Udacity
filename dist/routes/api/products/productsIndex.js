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
productsRouter.get('/get-by-cat', async (req, res) => {
    const cat = req.params.category;
    if (!cat) {
        console.error('Missing product category parameter');
        return res.status(400).json({ error: 'Missing product category parameter' });
    }
    try {
        const products = await getProductsByCategory(cat);
        res.status(200).json({ products });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch products by category', stack: err.stack });
    }
});
export default productsRouter;
//# sourceMappingURL=productsIndex.js.map