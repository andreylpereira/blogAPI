const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

router.get('/articles', (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    }).then(articles => {
        { articles: articles }
        res.send(articles);
    })
})

router.get('/admin/articles/new', (req, res) => {
    Category.findAll().then(categories => {
        res.send(categories);
    })
});

router.post('/articles/save', (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    console.log(category);

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        res.sendStatus(200);
    })
});

router.delete('/articles/delete', (req, res) => {
    var id = req.body.id;

    if (id !== undefined) {
        if (!isNaN(id)) {
            Article.destroy({ where: { id: id } })
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

module.exports = router;