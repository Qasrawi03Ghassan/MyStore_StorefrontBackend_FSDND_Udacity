import { Router } from 'express';
const ordersRouter = Router();
ordersRouter.get('/', (req, res) => {
    res.send('Orders route');
});
export default ordersRouter;
//# sourceMappingURL=ordersIndex.js.map