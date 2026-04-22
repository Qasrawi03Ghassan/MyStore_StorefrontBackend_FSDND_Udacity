import { Router } from "express";
const routes = Router();
routes.get('/', (req, res) => {
    res.send('Server is up');
});
export default routes;
//# sourceMappingURL=index.js.map