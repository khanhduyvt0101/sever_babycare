const express = require('express');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
const unless = require('express-unless');
var jsonServer = require('json-server');
const connectDB = require('./mongoDB/db');
const app = express();
require('dotenv').config();

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

const router_jsonServer = jsonServer.router('./database_mocking/db.json');
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

        return res.jsonp(result);
    }
    res.jsonp(res.locals.data);
};

app.use(express.json());

app.use('/users', require('./routes/users.routers.js'));
app.use('/baby', require('./routes/baby.routers.js'));

app.use('/api-mocking', jsonServer.defaults(), router_jsonServer);

app.use(errors.errorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log('Ready to port 3000');
});
