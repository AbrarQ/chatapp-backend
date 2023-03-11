const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const fs = require('fs')
const path = require('path')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

app.use(cors())
const morgan = require('morgan');
const LogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags : 'a'})
app.use(morgan('combined',{ stream : LogStream }) )
const sequelize = require('./utility/databaseConnection');
const users = require('./Models/loginsmodel')
const chats = require('./Models/chatsModel')
const groups = require('./Models/groupsListModel')
const userToGroup = require('./Models/userToGroupModel')
const adminGroup = require('./Models/admin-groupModel')

const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes')
const groupRoutes = require('./Routes/groupRoutes')


app.use('/user',userRoutes)
app.use('/chat',chatRoutes)
app.use('/group',groupRoutes)


app.use((req, res)=>{
    try{  console.log("url", req.url );
   
    res.sendFile(path.join(__dirname,`public/${req.url}`));
  
   
}catch(e){ console.log("ERr is from here")}})



users.hasMany(chats)
chats.belongsTo(users)

groups.hasMany(chats)
chats.belongsTo(groups)

users.belongsToMany(groups, {through : userToGroup })
groups.belongsToMany(users, {through : userToGroup})

users.belongsToMany(groups, {through : adminGroup})
groups.belongsToMany(users, {through : adminGroup})



 sequelize.sync({alter : true}).then(result => 
    {
        console.log("Database sync done")
        // console.log(result)

    }).catch(err => {
        console.log(err)
    })
app.listen(1000);
