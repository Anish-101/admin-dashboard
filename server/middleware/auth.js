const jwt = require('jsonwebtoken')

const SECRET_KEY = 'admSeCr3t';

const authAdminJwt = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const token = authorization.split(" ")[1];
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403)
            }
            req.user = user;
            next()
        })
    }
    else {
        return res.status(403)
    }
}

module.exports = { SECRET_KEY, authAdminJwt }