const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const connection = require('./database/database');

//import controlls
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');

//import models
const Article = require('./articles/Article');
const Category = require('./categories/Category');

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//database
connection.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados feita com sucesso!');
    }).catch((err) => {
        console.log(err);
    })

app.use("/", categoriesController);
app.use("/", articlesController);

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: { slug: slug }
    }).then((article) => {
        if (article !== undefined) {
            res.status(200).send(article);

        } else {
            res.sendStatus(400);

        }
    })
})


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Servidor online na porta: ${port}`))