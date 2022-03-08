const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['x-access-token']
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1]
        var decoded = jwt.decode(bearerToken)
        console.log(decoded);
        if (decoded.auth === true) {
            next();
        } else {
            res.send({
                status: 401,
                title: 'Error',
                message: 'Token inválido!'
            })
        }
    } else {
        res.send({
            status: 401,
            title: 'Error',
            message: 'Token inexistente/expirado!'
        })
    }
}

module.exports = verifyToken;