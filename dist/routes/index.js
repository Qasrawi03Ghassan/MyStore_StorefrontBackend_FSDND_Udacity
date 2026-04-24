import { Router } from "express";
import ordersRouter from "./api/orders/ordersIndex.js";
import productsRouter from "./api/products/productsIndex.js";
import usersRouter from "./api/users/usersIndex.js";
const routes = Router();
routes.use('/products', productsRouter);
routes.use('/orders', ordersRouter);
routes.use('/users', usersRouter);
routes.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is up' });
});
export default routes;
//# sourceMappingURL=index.js.map