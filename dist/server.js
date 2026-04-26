import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import cors from 'cors';
dotenv.config({
    quiet: true
});
const app = express();
const port = process.env.PORT || 8080;
const server = process.env.SERVER || 'localhost';
const address = `${server}:${port}`;
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.get('/', (req, res) => {
    res.redirect(301, '/api');
});
app.listen(port, () => {
    console.log(`Server started on http://${address}`);
});
export default { app, port, address };
//# sourceMappingURL=server.js.map