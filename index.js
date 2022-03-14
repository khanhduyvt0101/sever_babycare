import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import auth from './middlewares/auth.js'
import errors from './middlewares/errors.js'
import unless from 'express-unless'
import jsonServer from 'json-server'
import { connectDB } from './mongoDB/db.js'
import dotenv from 'dotenv'
import userRouter from './routes/users.routers.js'
import babyRouter from './routes/baby.routers.js'
import BMIRouter from './routes/bmi.routers.js';
const app = express()
dotenv.config()

mongoose.Promise = global.Promise;
connectDB();
auth.authenticateToken.unless = unless;
app.use(
    auth.authenticateToken.unless({
        path: [
            { url: '/users/login', methods: ['POST'] },
            { url: '/users/register', methods: ['POST'] },
        ],
    })
);

const router_jsonServer = jsonServer.router('./database_mocking/db.json')
router_jsonServer.render = (req, res) => {
    // Check GET with pagination
    // If yes, custom output
    const headers = res.getHeaders();

    const totalCountHeader = headers['x-total-count'];
    if (req.method === 'GET' && totalCountHeader) {
        const queryParams = queryString.parse(req._parsedUrl.query);

        const result = {
            data: res.locals.data,
            pagination: {
                _page: Number.parseInt(queryParams._page) || 1,
                _limit: Number.parseInt(queryParams._limit) || 10,
                _totalRows: Number.parseInt(totalCountHeader),
            },
        };

        return res.jsonp(result)
    }
    res.jsonp(res.locals.data)
};

app.use(express.json())
app.use(bodyParser.json())

app.use('/users', userRouter)
app.use('/baby', babyRouter)
app.use('/bmi', BMIRouter)

app.use('/api-mocking', jsonServer.defaults(), router_jsonServer)

app.use(errors.errorHandler)

app.listen(process.env.PORT || 3001, () => {
    console.log(`Ready to port ${process.env.PORT}`)
});
