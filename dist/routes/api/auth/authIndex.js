import dotenv from 'dotenv';
import { Router } from 'express';
import { createUser, showUserByFirstNameAndLastName } from '../../../models/user/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
dotenv.config({ quiet: true });
const authRouter = Router();
authRouter.get('/', async (req, res) => {
    res.status(200).json({ message: 'Reached Auth Index Route' });
});
authRouter.post('/register', async (req, res) => {
    const { first_name, last_name, password } = req.body;
    if (!first_name || !last_name || !password) {
        return res.status(400).json({ error: 'Missing required fields: first_name, last_name, and password are required' });
    }
    try {
        const existingUser = await showUserByFirstNameAndLastName(first_name, last_name);
        if (existingUser) {
            return res.status(409).json({ error: 'User with the same first name and last name already exists' });
        }
        const passwordHash = await bcrypt.hash(password + process.env.PEPPER, Number.parseInt(process.env.SALT_ROUNDS || '10'));
        const newUser = await createUser({ first_name, last_name, password_digest: passwordHash });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    }
    catch {
        res.status(500).json({ error: 'Couldn\'t register user' });
    }
});
authRouter.post('/login', async (req, res) => {
    const { first_name, last_name, password } = req.body;
    if (!first_name || !last_name || !password) {
        return res.status(400).json({ error: 'Missing required fields: first_name, last_name, and password are required' });
    }
    try {
        const user = await showUserByFirstNameAndLastName(first_name, last_name);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordHashValid = await bcrypt.compare(password + process.env.PEPPER, user.password_digest);
        if (!isPasswordHashValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name
        }, process.env.JWT_SECRET || 'defaultsecretkey!23', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch {
        res.status(500).json({ error: 'Couldn\'t login' });
    }
});
export default authRouter;
//# sourceMappingURL=authIndex.js.map