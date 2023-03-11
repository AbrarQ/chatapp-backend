// Sequelize 3rd party module
const Sequelize = require('sequelize');
//sequelize database connection
const sequelizeToDB = require('../utility/databaseConnection');

const groupsList = sequelizeToDB.define('groupslist',{

    groupid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
       
    },

    groupname: {
        type: Sequelize.STRING,
        allowNull: false,        
    },

    groupdesc: {
        type: Sequelize.STRING   
    },

    admin: {
        type: Sequelize.INTEGER,
        allowNull: false,   
    },


})

module.exports = groupsList

