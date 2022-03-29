const express = require('express');
const app = express();
const port = 8080;
const bodyParser = require('body-parser');
const connection = require('./database/database');
const cors = require('cors');
const res = require('express/lib/response');

//import controlls
const categoriesController = require('./categories/CategoriesController');
const articlesController = require('./articles/ArticlesController');
const usersController = require('./users/UserController');

//body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(
    cors({
      origin: '*',
      credentials: true
    })
  );

//database
connection.authenticate()
    .then(() => {
        res.status(200);
        res.send({
            msg: 'Conexão com o banco de dados feita com sucesso!'
        })
    }).catch(() => {
        res.status(500);
    })

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Servidor online na porta: ${port}`))