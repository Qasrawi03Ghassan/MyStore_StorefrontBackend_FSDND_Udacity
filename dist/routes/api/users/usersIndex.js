import { Router } from 'express';
import { createUser, getUsers, showUserById } from '../../../models/user/user.js';
import { verifyAuthToken } from '../middleware/mwIndex.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });
const usersRouter = Router();
usersRouter.get('/', verifyAuthToken, async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json({ "message": "Users fetched successfully", "users": users });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: 'Failed to fetch users', stack: err.stack });
    }
});
usersRouter.get('/:id', verifyAuthToken, async (req, res) => {
    const userId = Number(req.params.id);
    if (userId <= 0 || Number.isNaN(userId)) {
        console.error('Invalid user ID parameter');
        return res.status(400).json({ error: 'Invalid user ID parameter, must be a positive integer' });
    }
    try {
        const user = await showUserById(userId);
        res.status(200).json({ "message": "User fetched successfully", "user": user });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: 'Failed to fetch user', stack: err.stack });
    }
});
usersRouter.post('/', verifyAuthToken, async (req, res) => {
    const { first_name, last_name, password } = req.body;
    if (!first_name || !last_name || !password) {
        return res.status(400).json({ error: 'Missing required fields: first_name, last_name, and password are required' });
    }
    try {
        const password_digest = bcrypt.hashSync(password + process.env.PEPPER, Number.parseInt(process.env.SALT) || 10);
        const user = await createUser({ first_name, last_name, password_digest });
        res.status(200).json({ "message": "User created successfully", "user": user });
    }
    catch (err) { //Error type is unknown, so using any
        res.status(500).json({ error: 'Failed to create user', stack: err.stack });
    }
});
export default usersRouter;
//# sourceMappingURL=usersIndex.js.map