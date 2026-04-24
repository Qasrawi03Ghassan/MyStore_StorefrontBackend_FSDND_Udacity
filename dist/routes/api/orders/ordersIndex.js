import { Router } from 'express';
const ordersRouter = Router();
ordersRouter.get('/', (req, res) => {
    res.send({ message: 'Orders route' });
});
export default ordersRouter;
//# sourceMappingURL=ordersIndex.js.map