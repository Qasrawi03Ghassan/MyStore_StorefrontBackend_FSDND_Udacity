import { Router, Request, Response } from "express";
import ordersRouter from "./api/orders/ordersIndex.js";
import productsRouter from "./api/products/productsIndex.js";
import usersRouter from "./api/users/usersIndex.js";
import authRouter from "./api/auth/authIndex.js";

const routes = Router();

routes.use('/auth', authRouter);
routes.use('/products', productsRouter);
routes.use('/orders', ordersRouter);
routes.use('/users', usersRouter);


routes.get('/',(req: Request,res: Response) => {
    res.status(200).json({message: 'Server is up'});
});

export default routes;