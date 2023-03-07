const sequelize = require('sequelize');
const dataChecks = require('../Models/functions')
const chatModel = require('../Models/chatsModel')
const userloginModel = require('../Models/loginsmodel')
const groupsListModel = require('../Models/groupsListModel')


exports.postchat = async (req, res) => {



    try {
        console.log("Our request body is..", req.body)
        const token = req.header("Authorization");
        console.log(token);
        const userid = await dataChecks.tokenAuthentication(token)
        console.log(userid)


        await chatModel.create(({
            chat: req.body.chat,
            userLoginId: userid, 
            groupid : req.body.groupid
        })).then(respose => {
            res.status(200).json({ success: true })


        })
    } catch (err) {
        console.log(err, " at postChat Controller")
    }




}

exports.getchat = async (req, res, next) => {

    const lastmessageid = req.query.id

    const token = req.header("Authorization");
    // console.log(token);
    const userid = await dataChecks.tokenAuthentication(token)
    // console.log(userid)


    const chatstore = await chatModel.findAll({
        attributes: ['id','chat','groupid'],
        include: [{ 
            model : userloginModel,
            attributes : ['name'],
            required : true
        }],
      order : ['id']
    }).then(response => { return response })


const chatstore1 = JSON.stringify(chatstore)
const chatstore2 = JSON.parse(chatstore1);
console.log("sending this",chatstore)
const check = chatstore2[chatstore2.length-1].id
console.log("check",check,"last message id", lastmessageid)

if(check == lastmessageid ){
  res.status(200).json({update : false})
} else if (chatstore != null){
    res.status(200).json({chats : chatstore })
 }

 

   
    // console.log(chatstore)


    // const groupchatslist =  await groupsListModel.findAll()
    // .then(response => {return response})
 
    // if (chatstore != null){
    //    res.status(200).json({chats : chatstore, groupchats :groupchatslist })
    // }

}