import { Router } from 'express';
const usersRouter = Router();
usersRouter.get('/', (req, res) => {
    res.status(200).json({ message: 'Users route' });
});
export default usersRouter;
//# sourceMappingURL=usersIndex.js.map