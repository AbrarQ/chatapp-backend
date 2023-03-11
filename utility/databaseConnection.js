const Sequelize = require('sequelize');

const sequelize = new Sequelize (process.env.DB_NAME,process.env.MYSQL_USER,process.env.MYSQL_PASS,{
    dialect : 'mysql',
    host : process.env.DB_HOST
})

module.exports = sequelize;


// MYSQL_USER=admin
// MYSQL_PASS=H3lloworld!
// DB_NAME=chatapp
// DB_HOST=chatappdb.ccjbhdxwrrm6.us-east-1.rds.amazonaws.com