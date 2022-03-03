const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Category = require('../categories/Category');
const jwt = require('jsonwebtoken');

router.post('/categories/save', (req, res) => {
    var title = req.body.title;

    if (title !== undefined) {

        try {
            Category.create({
                title: title,
                slug: slugify(title)
            }).then(() => {
                res.status(204).send({});
            })
        } catch (error) {
            res.send({
                status: 500,
                error: 'Error',
                message: 'Não foi possível cadastrar a categoria!'
            })
        }
    }
})

router.get('/categories', verifyToken, (req, res) => {
    try {
        Category.findAll().then(categories => {
            { categories: categories }
            res.status(200).send(categories);
        })
    } catch (error) {
        res.send({
            status: 404,
            error: 'Error',
            message: 'Error ao carregar as categorias!'
        })
    }
});

router.delete('/categories/delete', (req, res) => {
    var id = req.body.id;

    try {
        if (id !== undefined) {
            if (!isNaN(id)) {
                Category.destroy({ where: { id: id } })
                    .then(() => {
                        res.status(204).send({});
                    })
            } else {
                res.sendStatus(404);
            }

        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.send({
            status: 500,
            error: 'Error',
            message: 'Não foi possível deletar a categoria!'
        })
    }
})

router.get('/categories/:id', (req, res) => {
    var id = req.params.id;

    try {
        if (!isNaN(id)) {
            Category.findByPk(id).then((category) => {
                res.status(200).send(category);
            })
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        res.send({
            status: 404,
            error: 'Error',
            message: 'Error ao carregar a categoria!'
        })
    }
})

router.put('/categories/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    try {
        Category.update({ title: title, slug: slugify(title) },
            { where: { id: id } }).then(() => {
                res.status(204).send({});
            })
    } catch (error) {
        res.send({
            status: 500,
            error: 'Error',
            message: 'Não foi possível atualizar a categoria!'
        })
    }
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