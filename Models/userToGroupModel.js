// Sequelize 3rd party module
const Sequelize = require('sequelize');
//sequelize database connection
const sequelizeToDB = require('../utility/databaseConnection');

const userToGroup = sequelizeToDB.define('userGroup',{
  
    


      admin : { 
        type : Sequelize.STRING,
        allowNull : false, 
        
      }


})





// sequelizeToDB.sync();

module.exports = userToGroup