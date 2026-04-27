import {Router, Request, Response} from 'express';
import {Product, getProducts, showProduct, getTop5MostPopularProducts, getProductsByCategory, createProduct, updateProduct, deleteProduct} from '../../../models/product/product.js';
import { verifyAuthToken } from '../middleware/mwIndex.js';

const productsRouter = Router();

productsRouter.get('/', async (req: Request,res: Response) =>  {
    try{
        const products: Product[] = await getProducts();
        res.status(200).json({message: 'Products fetched successfully', products});
    }catch(err :any){//Error type is unknown, so using any
        res.status(500).json({error: 'Failed to fetch products',stack: err.stack});
    }
});

productsRouter.get('/most-popular', async (req: Request,res: Response) =>  {
    try{
        const products: Product[] = await getTop5MostPopularProducts();
        res.status(200).json({message: 'Most popular products fetched successfully', products});
    }catch(err :any){//Error type is unknown, so using any
        res.status(500).json({error: 'Failed to fetch most popular products',stack: err.stack});
    }
});

productsRouter.get('/get-by-cat', async (req: Request,res: Response) =>  {
    const productCategory = req.query.cat as string;
    if(!productCategory){
        console.error('Missing product category parameter');
        return res.status(400).json({error: 'Missing product category parameter'});
    }

    const checkNum = Number(productCategory);
    if(!Number.isNaN(checkNum)){
        console.error('Invalid product category parameter');
        return res.status(400).json({error: 'Invalid product category parameter,must be a string'});
    }

    try{
        const products: Product[] = await getProductsByCategory(productCategory);
        res.status(200).json({message: 'Products fetched by category successfully', products});
    }catch(err :any){//Error type is unknown, so using any
        res.status(500).json({error: 'Failed to fetch products by category',stack: err.stack});
    }
});

productsRouter.post('/', verifyAuthToken,async (req: Request,res: Response) =>  {
    try{
        const product: Product = await createProduct(req.body);
        res.status(200).json({message:"Product created successfully",product});
    }catch(err :any){//Error type is unknown, so using any
        res.status(500).json({error: 'Failed to create product',stack: err.stack});
    }
});

productsRouter.get('/:id', async (req: Request,res: Response) =>  {
    const productId = Number(req.params.id);
    
    try{
        const product: Product = await showProduct(productId);
        res.status(200).json({message: `Product ${productId} fetched successfully`, product});
    }catch(err :any){//Error type is unknown, so using any
        res.status(500).json({error: `Failed to fetch product ${productId}`,stack: err.stack});
    }
});

productsRouter.post('/:id', verifyAuthToken,async (req: Request,res: Response) =>  {
    const id = Number(req.params.id);
    const {name, price, category} = req.body;
    if(!id || !name || !price){
        return res.status(400).json({error: 'Missing required fields: id, name and price are required'});
    }
    try{
        const product: Product = await showProduct(id);
        if(!product){
            return res.status(404).json({error: `Product with ID ${id} not found`});
        }
        const updatedProduct: Product = await updateProduct({id, name, price, category});
        res.status(200).json({message: `Product ${id} updated successfully`, product: updatedProduct});
    }catch(err :any){//Error type is unknown, so using any
        res.status(500).json({error: `Failed to update product ${id}`,stack: err.stack});
    }
});

productsRouter.delete('/:id', verifyAuthToken,async (req: Request,res: Response) =>  {
    const productId = Number(req.params.id);

    try{
        const product: Product = await showProduct(productId);
        if(!product){
            return res.status(404).json({error: `Product with ID ${productId} not found`});
        }
        const deletedProduct: Product = await deleteProduct(productId);
        res.status(200).json({message: `Product ${productId} deleted successfully`, product: deletedProduct});
    }catch(err :any){//Error type is unknown, so using any
        res.status(500).json({error: `Failed to delete product ${productId}`,stack: err.stack});
    }
});

export default productsRouter;