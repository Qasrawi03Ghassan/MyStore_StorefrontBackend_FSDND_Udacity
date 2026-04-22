import { Router, Request, Response } from "express";

const routes = Router();

routes.get('/',(req: Request,res: Response) => {
    res.send('Server is up');
});

export default routes;