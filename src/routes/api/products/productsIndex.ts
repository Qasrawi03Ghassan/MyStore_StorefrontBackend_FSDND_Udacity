import {Router, Request, Response} from 'express';
import {Product, getProducts, showProduct, getTop5MostPopularProducts, getProductsByCategory, createProduct} from '../../../models/product/product.js';

const productsRouter = Router();

productsRouter.get('/', async (req: Request,res: Response) =>  {
    try{
        const products: Product[] = await getProducts();
        res.status(200).json({products});
    }catch(err :any){
        res.status(500).json({error: 'Failed to fetch products',stack: err.stack});
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
        res.status(200).json({products});
    }catch(err :any){
        res.status(500).json({error: 'Failed to fetch products by category',stack: err.stack});
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

//Todo: add jwt
productsRouter.post('/', async (req: Request,res: Response) =>  {
    try{
        const product: Product = await createProduct(req.body);
        res.status(200).json({product});
    }catch(err :any){
        res.status(500).json({error: 'Failed to create product',stack: err.stack});
    }
});


export default productsRouter;