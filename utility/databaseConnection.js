const Sequelize = require('sequelize');

const sequelize = new Sequelize ('chatapp','root','H3lloworld!',{
    dialect : 'mysql',
    host : 'localhost'
})

module.exports = sequelize;
