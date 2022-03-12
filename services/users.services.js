import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import auth from '../middlewares/auth.js'

async function login({ username, password }, callback) {
    const user = await User.findOne({ username });

    if (user != null) {
        if (bcrypt.compareSync(password, user.password)) {
            const token = auth.generateAccessToken(username);
            return callback(null, { ...user.toJSON(), token });
        } else {
            return callback({
                message: 'Invalid Username/Password!',
            });
        }
    } else {
        return callback({
            message: 'Invalid Username/Password!',
        });
    }
}

async function register(param, callback) {
    if (param.username === undefined) {
        return callback({ message: 'Username Required' });
    }

    const user = new User(param);
    user.save()
        .then((result) => {
            return callback(null, result);
        })
        .catch((err) => {
            return callback(err);
        });
}

export default {
    login,
    register,
};
