import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config({
    quiet:true
});

const app: express.Application = express();
const port = process.env.PORT;
const server = process.env.SERVER;
const address: string = `${server}:${port}`

app.use('/api',routes);

app.get('/',(req,res) => {
    res.redirect(301,'/api');
})

app.listen(port,()=>{
    console.log(`Server started on http://${address}`);
});

export default {app,port,address};