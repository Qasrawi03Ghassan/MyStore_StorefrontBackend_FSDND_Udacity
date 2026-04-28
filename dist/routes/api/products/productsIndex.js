import { Router } from 'express';
import { getProducts, showProduct, getTop5MostPopularProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct } from '../../../models/product/product.js';
import { verifyAuthToken } from '../middleware/mwIndex.js';
const productsRouter = Router();
productsRouter.get('/', async (req, res) => {
    try {
        const products = await getProducts();
        res.status(200).json({ message: 'Products fetched successfully', products });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: 'Failed to fetch products', stack: err.stack });
    }
});
productsRouter.get('/most-popular', async (req, res) => {
    try {
        const products = await getTop5MostPopularProducts();
        res.status(200).json({ message: 'Most popular products fetched successfully', products });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: 'Failed to fetch most popular products', stack: err.stack });
    }
});
productsRouter.get('/get-by-cat', async (req, res) => {
    const productCategory = req.query.cat;
    if (!productCategory) {
        console.error('Missing product category parameter');
        return res.status(400).json({ error: 'Missing product category parameter' });
    }
    const checkNum = Number(productCategory);
    if (!Number.isNaN(checkNum)) {
        console.error('Invalid product category parameter');
        return res.status(400).json({ error: 'Invalid product category parameter,must be a string' });
    }
    try {
        const products = await getProductsByCategory(productCategory);
        res.status(200).json({ message: 'Products fetched by category successfully', products });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: 'Failed to fetch products by category', stack: err.stack });
    }
});
productsRouter.post('/', verifyAuthToken, async (req, res) => {
    try {
        const product = await createProduct(req.body);
        res.status(201).json({ message: "Product created successfully", product });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: 'Failed to create product', stack: err.stack });
    }
});
productsRouter.get('/:id', async (req, res) => {
    const productId = Number(req.params.id);
    try {
        const product = await showProduct(productId);
        if (!product) {
            return res.status(404).json({ error: `Product with id ${productId} does not exist` });
        }
        res.status(200).json({ message: `Product ${productId} fetched successfully`, product });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: `Failed to fetch product ${productId}`, stack: err.stack });
    }
});
productsRouter.put('/:id', verifyAuthToken, async (req, res) => {
    const id = Number(req.params.id);
    const { name, price, category } = req.body;
    if (!id || !name || !price) {
        return res.status(400).json({ error: 'Missing required fields: id, name and price are required' });
    }
    try {
        const product = await showProduct(id);
        if (!product) {
            return res.status(404).json({ error: `Product with ID ${id} not found` });
        }
        const updatedProduct = await updateProduct({ id, name, price, category });
        res.status(200).json({ message: `Product ${id} updated successfully`, product: updatedProduct });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: `Failed to update product ${id}`, stack: err.stack });
    }
});
productsRouter.delete('/:id', verifyAuthToken, async (req, res) => {
    const productId = Number(req.params.id);
    try {
        const product = await showProduct(productId);
        if (!product) {
            return res.status(404).json({ error: `Product with ID ${productId} not found` });
        }
        const deletedProduct = await deleteProduct(productId);
        res.status(200).json({ message: `Product ${productId} deleted successfully`, product: deletedProduct });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: `Failed to delete product ${productId}`, stack: err.stack });
    }
});
export default productsRouter;
//# sourceMappingURL=productsIndex.js.map