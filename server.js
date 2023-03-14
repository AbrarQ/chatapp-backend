const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express();
const fs = require('fs')
const path = require('path')

const server = require('http').createServer(app)
const io = require('socket.io')(server,{cors : {origin :"*"}})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))
app.use(cors())

//We are using a different port of websockets and 
//we are using a new port 1000 for websockets and 
//we are using cors as our data origin in from localhost:4000 and we are listening on 1000, 
//so we dont want to be blocked by cors



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
const groupRoutes = require('./Routes/groupRoutes');



app.use('/user',userRoutes)
app.use('/chat',chatRoutes)
app.use('/group',groupRoutes)


// app.use((req, res)=>{
//     try{  console.log("url", req.url );
   
//     res.sendFile(path.join(__dirname,`public/${req.url}`));
  
   
// }catch(e){ console.log("ERr is from here")}})



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
server.listen(4000,()=>{console.log("server Running")});


// const chatController = require('./Controllers/chatController')

// console.log("nearing socket")
// io.on('connection', (socket)=>{
//     console.log(socket.id)

   
//      socket.on('join-room',(groupid,cb)=>{
//         console.log("this is",groupid)
//          socket.join(groupid)
//          cb(`Joined ${groupid}`)




//      socket.on('send-chat',async(data)=>{
//         console.log(data)
//        const res = await chatController.postchat(data)
//        console.log("becore check",groupid)
//        console.log(socket.rooms);
      

//       try{
//         socket.to(groupid).emit('send-chat',{res:res})
//       }catch(e){console.log("err at to",e)}
    
//     })
// })
//     // socket.on('sendmessage',(message)=>{
       
//     //     console.log(message)
//     // })

//     // socket.on("sendchat",(obj)=>{
//     //     console.log(obj)
//     // })

// })


// // //52.72.228.99