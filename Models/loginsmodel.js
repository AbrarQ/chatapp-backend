// Sequelize 3rd party module
const Sequelize = require('sequelize');
//sequelize database connection
const sequelizeToDB = require('../utility/databaseConnection');

const logins = sequelizeToDB.define('userLogins',{
    id : { 
        type : Sequelize.INTEGER, 
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
      },
    
      name : { 
        type : Sequelize.STRING, 
        allowNull : false,
     
      },
    
      email : { 
        type : Sequelize.STRING,
        allowNull : false, 
        
      },
      phonenumber : { 
        type : Sequelize.INTEGER,
        allowNull : false, 
        
      },
      password : { 
        type : Sequelize.STRING,
        allowNull : false, 
        
      }      
    })

module.exports = logins