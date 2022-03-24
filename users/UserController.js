const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('./UserMiddleware');


router.get("/admin/users", (req, res) => {
    try {
        User.findAll().then(users => {
            { users: users }
            res.status(200).send(users);
        })
    } catch (error) {
        res.send({
            status: 500,
            title: 'Error',
            message: 'Não foi possível conectar com o servidor!'
        })
    }
})

router.post("/admin/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;

    try {
        User.findOne({ where: { email: email } }).then(user => {
            if (user == undefined) {
                var salt = bcrypt.genSaltSync(13);
                var hash = bcrypt.hashSync(password, salt);
                try {
                    User.create({ email: email, password: hash, firstName: firstName, lastName: lastName }).then((user) => {
                        res.status(201).send(user);
                    })
                } catch (error) {
                    res.send({
                        status: 400,
                        title: 'Error',
                        message: 'Não foi possível cadastrar o usuário!'
                    })
                }
            } else {
                res.send({
                    status: 400,
                    title: 'Error',
                    message: 'Usuário já cadastrado!'
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.send({
            status: 500,
            title: 'Error',
            message: 'Não foi possível conectar com o servidor!'
        })
    }

})

router.post('/admin/authenticate', async (req, res) => {

    var secret = 'secret123';
    var email = req.body.email;
    var password = req.body.password;

    try {
        await User.findOne({ where: { email: email } }).then(user => {
            if (user != undefined) {
                var validate = bcrypt.compareSync(password, user.password);
                if (validate) {
                    var id = user.id;
                    const token = jwt.sign({ id, auth: true }, secret, {
                        expiresIn: 5000
                    });
                    res.send(200, {
                        id: id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: token
                    })
                } else {
                    res.send({
                        status: 400,
                        title: 'Error',
                        message: 'Senha inválida!'
                    })
                }
            } else {
                res.send({
                    status: 400,
                    title: 'Error',
                    message: 'E-mail inválido!'
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.send({
            status: 500,
            title: 'Error',
            message: 'Não foi possível conectar com o servidor!'
        })
    }

})

module.exports = router;