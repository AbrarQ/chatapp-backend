const sequelize = require('sequelize');
const dataChecks = require('../Models/functions')
const chatModel = require('../Models/chatsModel')
const userloginModel = require('../Models/loginsmodel')
const { QueryTypes } = require('sequelize');


exports.postchat = async (req, res) => {



    try {
        console.log("Our request body is..", req.body.chat)
        const token = req.header("Authorization");
        console.log(token);
        const userid = await dataChecks.tokenAuthentication(token)
        console.log(userid)


        await chatModel.create(({
            chat: req.body.chat,
            userLoginId: userid
        })).then(respose => {
            res.status(200).json({ success: true })


        })
    } catch (err) {
        console.log(err, " at postChat Controller")
    }




}

exports.getchat = async (req, res, next) => {
    const token = req.header("Authorization");
    console.log(token);
    const userid = await dataChecks.tokenAuthentication(token)
    console.log(userid)


    // const chatstore = await userloginModel.findAll({
    //     attributes: ['name',[sequelize.col('chatsTables.chat'),'chat']],
    //     include: [{ 
    //         model :chatModel 
    //     }]
    // }).then(response => { return response })
    const chatstore = await chatModel.findAll({
        attributes: ['id','chat'],
        include: [{ 
            model : userloginModel,
            attributes : ['name'],
            required : true
        }],
      order : ['id']
    }).then(response => { return response })

    // const chatstore = await chatModel.findAll({
    //     include: userloginModel,
    //     attribute : ['name']


    const stringi = JSON.stringify(chatstore);
    const par = JSON.parse(stringi)
    console.log(par)
    // console.log(chatstore)

    if (chatstore != null){
       res.status(200).json({chat : chatstore})
    }

}