const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Category = require('../categories/Category');
const verifyToken = require('../users/UserMiddleware')

router.post('/admin/categories/save', verifyToken, (req, res) => {

    var title = req.body.title;
    if (title !== undefined) {

        try {
            Category.create({
                title: title,
                slug: slugify(title)
            }).then(() => {
                res.status(200);
            })
        } catch (error) {
            res.send({
                status: 500,
                title: 'Error',
                message: 'Não foi possível cadastrar a categoria!'
            })
        }
    }
})

router.get('/categories', (req, res) => {
    try {
        Category.findAll().then(categories => {
            res.status(200).json(categories);
        })
    } catch (error) {
        res.send({
            status: 404,
            title: 'Error',
            message: 'Error ao carregar as categorias!'
        })
    }
});

router.delete('/admin/categories/:id/delete', verifyToken, (req, res) => {
    var id = req.params.id;

    try {
        if (id !== undefined) {
            if (!isNaN(id)) {
                Category.destroy({ where: { id: id } })
                    .then(() => {
                        res.status(200).send({});
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
            title: 'Error',
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
            res.status(404);
        }
    } catch (error) {
        res.send({
            status: 404,
            title: 'Error',
            message: 'Error ao carregar a categoria!'
        })
    }
})

router.put('/admin/categories/update', verifyToken, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    try {
        Category.update({ title: title, slug: slugify(title) },
            { where: { id: id } }).then(() => {
                res.status(200);
            })
    } catch (error) {
        res.send({
            status: 500,
            title: 'Error',
            message: 'Não foi possível atualizar a categoria!'
        })
    }
})

module.exports = router;