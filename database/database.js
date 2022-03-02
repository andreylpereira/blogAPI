const Sequelize = require('sequelize');

const connection = new Sequelize('blog', 'root', '12345', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;