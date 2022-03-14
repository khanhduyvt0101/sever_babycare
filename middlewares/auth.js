import jwt from 'jsonwebtoken'

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, 'Auth_Key', (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next()
    })
}

function generateAccessToken(username) {
    return jwt.sign({ data: username }, 'Auth_Key', {
        expiresIn: '96h',
    })
}

export default {
    authenticateToken,
    generateAccessToken,
}
