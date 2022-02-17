const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');
const auth = require('./middlewares/auth');
const errors = require('./middlewares/errors');
const unless = require('express-unless');
const app = express();

mongoose.Promise = global.Promise;
mongoose
    .connect(dbConfig.db, {
        useNewUrlParser: true,
        useUnifledTopology: true,
    })
    .then(
        () => {
            console.log('Database connected');
        },

        (error) => {
            console.log('Database cant be connected' + error);
        }
    );
auth.authenticateToken.unless = unless;
app.use(
    auth.authenticateToken.unless({
        path: [
            { url: '/users/login', methods: ['POST'] },
            { url: '/users/register', methods: ['POST'] },
        ],
    })
);

app.use(express.json());

app.use('/users', require('./routes/users.routers.js'));
app.use('/api', require('./routes/crud.routers.js'));

app.use(errors.errorHandler);

app.listen(process.env.PORT || 3000, () => {
    console.log('Ready to port 3000');
});
