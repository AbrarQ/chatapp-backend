const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors())
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
