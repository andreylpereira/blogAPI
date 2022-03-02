const express = require('express');
const router = express.Router();
const slugify = require('slugify');
const Category = require('../categories/Category');


router.post('/categories/save', (req, res) => {

    var title = req.body.title;
    console.log(title);
    if (title !== undefined) {

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.sendStatus(200);
        })
    }
})

router.get('/admin/categories', (req, res) => {
    Category.findAll().then(categories => {
        { categories: categories }
        res.send(categories);
    })
});

router.delete('/admin/categories', (req, res) => {
    var id = req.body.id;

    if (id !== undefined) {
        if (!isNaN(id)) {
            Category.destroy({ where: { id: id } })
                .then(() => {
                    res.sendStatus(200);
                })

        } else {
            console.log('não é um número');
        }

    } else {
        console.log('não foi possivel');
    }
})

router.get('/admin/categories/edit/:id', (req, res) => {
    var id = req.params.id;
    if (isNaN(id)) {
        Category.findByPk(id).then((categories) => {
            res.send(categories);
        })
    } else {
        res.sendStatus(404);
    }
})

router.put('/categories/update', (req, res) => {
    var id = req.body.id;
    var title = req.body.title;

    Category.update({ title: title },
        { where: { id: id } }).then(() => {
            res.sendStatus(200);
        })
})

module.exports = router;