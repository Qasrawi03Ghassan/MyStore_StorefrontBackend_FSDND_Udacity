import { Router } from 'express';
const productsRouter = Router();
productsRouter.get('/', (req, res) => {
    res.send('Products route');
});
export default productsRouter;
//# sourceMappingURL=productsIndex.js.map