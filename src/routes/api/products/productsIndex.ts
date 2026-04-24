import {Router, Request, Response} from 'express';
import {Product, getProducts, showProduct, getTop5MostPopularProducts, getProductsByCategory} from '../../../models/product/product.js';

const productsRouter = Router();

productsRouter.get('/', async (req: Request,res: Response) =>  {
    try{
        const products: Product[] = await getProducts();
        res.status(200).json({products});
    }catch(err :any){
        res.status(500).json({error: 'Failed to fetch products',stack: err.stack});
    }
});

productsRouter.get('/:id', async (req: Request,res: Response) =>  {
    const productId = Number(req.params.id);
    try{
        const product: Product = await showProduct(productId);
        res.status(200).json({product});
    }catch(err :any){
        res.status(500).json({error: `Failed to fetch product ${productId}`,stack: err.stack});
    }
});

productsRouter.get('/most-popular', async (req: Request,res: Response) =>  {
    try{
        const products: Product[] = await getTop5MostPopularProducts();
        res.status(200).json({products});
    }catch(err :any){
        res.status(500).json({error: 'Failed to fetch most popular products',stack: err.stack});
    }
});
// TODO: Implement this route
/*
productsRouter.get('/:category', async (req: Request,res: Response) =>  {
    const productCategory = String(req.params.category);
    try{
        const products: Product[] = await getProductsByCategory(productCategory);
        res.status(200).json({products});
    }catch(err :any){
        res.status(500).json({error: 'Failed to fetch products by category',stack: err.stack});
    }
});*/

export default productsRouter;