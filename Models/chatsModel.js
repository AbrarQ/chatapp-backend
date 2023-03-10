// Sequelize 3rd party module
const Sequelize = require('sequelize');
//sequelize database connection
const sequelizeToDB = require('../utility/databaseConnection');

const chats = sequelizeToDB.define('chatsTable',{
    id : { 
        type : Sequelize.INTEGER, 
        autoIncrement : true,
        allowNull : false,
        primaryKey : true,
      },
    
      chat : { 
        type : Sequelize.STRING, 
        allowNull : false,
     
      },
      groupid: {
        type: Sequelize.INTEGER,
    
    }

    })

module.exports = chats