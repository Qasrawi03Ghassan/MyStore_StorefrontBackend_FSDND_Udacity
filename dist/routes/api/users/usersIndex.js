import { Router } from 'express';
const usersRouter = Router();
usersRouter.get('/', (req, res) => {
    res.send('Users route');
});
export default usersRouter;
//# sourceMappingURL=usersIndex.js.map