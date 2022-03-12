import bcryptjs from 'bcryptjs'
import userService from '../services/users.services.js'

const register = (req, res, next) => {
    const { password } = req.body;
    const salt = bcryptjs.genSaltSync(10)

    req.body.password = bcryptjs.hashSync(password, salt)

    userService.register(req.body, (err, result) => {
        if (err) {
            return next(err)
        }
        return res.status(200).send({
            message: 'Success',
            data: result,
        });
    });
};

const login = (req, res, next) => {
    const { username, password } = req.body

    userService.login({ username, password }, (err, result) => {
        if (err) {
            console.log(err)
            return next(err)
        }
        console.log(result);
        return res.status(200).send({
            message: 'Success',
            data: result,
        });
    });
};

const userProfile = (req, res, next) => {
    return res.status(200).json({
        message: 'Authorized User!',
    });
};

export default {
    register,
    login,
    userProfile
}


