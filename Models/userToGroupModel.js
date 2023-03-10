// Sequelize 3rd party module
const Sequelize = require('sequelize');
//sequelize database connection
const sequelizeToDB = require('../utility/databaseConnection');

const userToGroup = sequelizeToDB.define('userGroup',{
  
    


//     logins.define({
//       id : { 
//         type : Sequelize.INTEGER, 
//         autoIncrement : true,
//         allowNull : false,
//         primaryKey : true,
//       },
    
//       name : { 
//         type : Sequelize.STRING, 
//         allowNull : false,
     
//       },
    
//       email : { 
//         type : Sequelize.STRING,
//         allowNull : false, 
        
//       },
      admin : { 
        type : Sequelize.STRING,
        allowNull : false, 
        
      }
//       password : { 
//         type : Sequelize.STRING,
//         allowNull : false, 
        
//       },

//       groupids: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING),

})





// sequelizeToDB.sync();

module.exports = userToGroup