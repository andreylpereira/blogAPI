const express = require('express');
const app = express();
const port = 8080
const bodyParser = require('body-parser');
const connection = require('./database/database')

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



app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Servidor online na porta: ${port}`))