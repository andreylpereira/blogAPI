const express = require('express');
const router = express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const verifyToken = require('../users/UserMiddleware')

router.get('/articles', (req, res) => {
    try {
        Article.findAll({
            order: [
                ['id', 'DESC']
            ],
            include: [{ model: Category }]
        }).then(articles => {
            { articles: articles }
            res.status(200).send(articles);
        })
    } catch (error) {
        res.send({
            status: 500,
            title: 'Erro!',
            message: 'Erro ao carregar os artigos.'
        })
    }
})

router.post('/admin/articles/save', verifyToken, (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var author = req.body.author;

    try {
        Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoryId: category,
            author: author
        }).then((data) => {
            res.send(200, {
                title: 'Sucesso!',
                message: 'Artigo criado com sucesso.'
            })
        })
    } catch (error) {
        res.send({
            status: 404,
            title: 'Erro!',
            message: 'Não foi possível cadastrar o artigo.'
        })
    }
});

router.delete('/admin/articles/:id/delete', verifyToken, (req, res) => {
    var id = req.params.id;

    try {
        if (id !== undefined) {
            if (!isNaN(id)) {
                Article.destroy({ where: { id: id } })
                    .then(() => {
                        res.send(200, {
                            title: 'Sucesso!',
                            message: 'Artigo deletado com sucesso.'
                        })
                    })

            } else {
                res.send({
                    status: 404,
                    title: 'Erro!',
                    message: 'Artigo não encontrado.'
                })
            }
        } else {
            res.send({
                status: 404,
                title: 'Erro!',
                message: 'Artigo não encontrado.'
            })
        }
    } catch (error) {
        res.send({
            status: 404,
            title: 'Erro!',
            message: 'Não foi possível deletar o artigo.'
        })
    }
})

router.get('/categories/:id/article', (req, res) => {
    var id = req.params.id

    try {
        Article.findByPk(id)
        .then(article => {
            res.status(200).send(article);
        })
    } catch (error) {
        res.send({
            status: 500,
            title: 'Erro!',
            message: 'Erro ao carregar o artigo.'
        })
    }
})



router.get('/articles/:id', (req, res) => {
    var id = req.params.id;

    try {
        Article.findByPk(id).then(article => {
            res.status(200).send(article);
        })
    } catch (error) {
        res.send({
            status: 500,
            title: 'Erro!',
            message: 'Erro ao carregar o artigo.'
        })
    }
})

router.put('/admin/articles/update', verifyToken, (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var author = req.body.author;

    try {
        Article.update({
            title: title,
            body: body,
            categoryId: category,
            slug: slugify(title),
            author: author
        },
            { where: { id: id } }).then(() => {
                res.send(200, {
                    title: 'Sucesso!',
                    message: 'Artigo atualizado com sucesso.'
                })
            })
    } catch (error) {
        res.send({
            status: 500,
            title: 'Erro!',
            message: 'Não foi possível atualizar o artigo.'
        })
    }
})

router.get('/articles/page/:num', (req, res) => {
    var page = req.params.num;
    var offset = 0;

    try {
        if (isNaN(page) || page == 1) {
            offset = 0
        } else {
            offset = (parseInt(page) - 1) * 4;
        }

        Article.findAndCountAll({ limit: 4, offset: offset }).then(articles => {

            var next;
            if (offset + 4 >= articles.count) {
                next = false;
            } else {
                next = true;
            }

            var result = {
                next: next,
                articles: articles
            }

            res.json(result)
        })
    } catch (error) {
        res.send({
            status: 500,
            title: 'Erro!',
            message: 'Erro ao carregar os artigos.'
        })
    }
})


router.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: { slug: slug }
    }).then((article) => {
        if (article !== undefined) {
            res.status(200).send(article);

        } else {
            res.send({
                status: 500,
                title: 'Erro!',
                message: 'Erro ao carregar os artigos.'
            })
        }
    })
})

module.exports = router;