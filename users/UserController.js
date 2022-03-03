const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get("/admin/users", verifyToken, (req, res) => {
    try {
        User.findAll().then(users => {
            { users: users }
            res.status(200).send(users);
        })
    } catch (error) {
        res.send({
            status: 404,
            error: 'Error',
            message: 'Error ao carregar ao listar usuários!'
        })
    }
})

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(13);
            var hash = bcrypt.hashSync(password, salt);
            try {
                User.create({ email: email, password: hash, firstName: firstName, lastName: lastName }).then((user) => {
                    res.status(204).send(user);
                })
            } catch (error) {
                res.send({
                    status: 500,
                    error: 'Error',
                    message: 'Não foi possível cadastrar o usuário!'
                })
            }
        } else {
            res.send({
                status: 500,
                error: 'Error',
                message: 'Usuário já cadastrado!'
            })
        }
    })

})

router.post('/authenticate', async (req, res) => {

    var secret = 'secret123';
    var email = req.body.email;
    var password = req.body.password;

    await User.findOne({ where: { email: email } }).then(user => {
        if (user != undefined) {
            var validate = bcrypt.compareSync(password, user.password);
            if (validate) {
                var id = user.id;
                const token = jwt.sign({ id, auth: true }, secret, {
                    expiresIn: 5000
                });
                res.send({
                    id: id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: token
                })
            } else {
                res.send({
                    status: 500,
                    error: 'Error',
                    message: 'Senha inválida!'
                })
            }
        } else {
            res.send({
                status: 500,
                error: 'Error',
                message: 'E-mail inválido!'
            })
        }
    })

})

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
                error: 'Error',
                message: 'Token inválido!'
            })
        }
    } else {
        res.send({
            status: 401,
            error: 'Error',
            message: 'Token inexistente/expirado!'
        })
    }
}

module.exports = router;