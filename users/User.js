const Sequelize = require('sequelize');
const connection = require('../database/database');

const User = connection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }, password: {
        type: Sequelize.STRING,
        allowNull: false
    }, firstName: {
        type: Sequelize.STRING,
        allowNull: false
    }, lastName: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

//sincronizando com o bd / criando tabela
//User.sync({force: true});

module.exports = User;