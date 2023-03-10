

const { Op } = require('sequelize');
const dataChecks = require('../Models/functions')
const groupsModel = require('../Models/groupsListModel')
const userloginModel = require('../Models/loginsmodel');
const sequelize = require('../utility/databaseConnection');
const userToGroup = require('../Models/userToGroupModel')
const chatModel = require('../Models/chatsModel')




exports.addnewgroup = async (req, res) => {


    const token = req.header("Authorization");
    console.log(token);
    const userid = await dataChecks.tokenAuthentication(token);

    const groupID = dataChecks.generateGroupID();
    console.log(await fetchlist(userid));


    const groupnameCheck = await dataChecks.groupnameCheck(req.body.groupname);
    if (groupnameCheck.length == 0) {

        const t = await sequelize.transaction();

        await groupsModel.create({
            groupid: groupID,
            groupname: req.body.groupname,
            groupdesc: req.body.groupdescription,
            admin: userid

        }, { transaction: t }).then(async (response) => {
            console.log(groupID)

            await userToGroup.create({
                userLoginId: userid,
                groupslistGroupid: groupID,
                admin: userid
            }, { transaction: t }).then(async () => {
                const grouplist = await fetchlist(userid)
                await t.commit()
                res.status(200).json({ message: "Group Chat Created", grouplist: grouplist, currentgroup: response })
            }).catch(async (err) => {
                await t.rollback();
                console.log(err)
                res.status(500).json({ error: err })
            })

        }).catch(async (err) => {
            await t.rollback();
            console.log(err)
            res.status(500).json({ error: err })
        })





    } else {
        res.status(402).json({ message: "A Similar Group Chat Exists..." })
    }


}

exports.getlist = async (req, res) => {
    const token = req.header("Authorization");
    console.log(token);
    const userid = await dataChecks.tokenAuthentication(token);
    console.log(userid)

    res.status(200).json({ grouplist: await fetchlist(userid) })


}


async function fetchlist(userid) {
    console.log(userid)
    const list = await userToGroup.findAll({
        attributes: ['groupslistGroupid'],
        where: { userLoginId: userid },

    }).then((response) => {

        // for(let i=0; i< response.length;i++){
        //     groupIds.push(response[i].groupslistGroupid)
        // }
        const keys = response.map(id => id.get('groupslistGroupid'))
        return keys;

    })

    console.log(list.length)
    if (list.length != 0) {
        return await groupsModel.findAll({
            where: {
                groupid: {
                    [Op.or]: list
                }
            }
        }
        )
            .then((response) => response)
    } else {
        return null
    }
}





// ADD USER CONTROLLER
exports.adduser = async (req, res, next) => {
    console.log(req.body)
    const token = req.header("Authorization");
    console.log(token);
    const adminid = await dataChecks.tokenAuthentication(token);




    const userid = await userloginModel.findOne({
        attributes: ['id'],
        where: { name: req.body.username },

    })
        .then((response) => {
            return response.dataValues.id
        }).catch(err => { return null })

    console.log("THis is", userid)
    if (userid == null) {
        // console.log("answer is null")
        res.json({ message: "No Such user Exists" })

    } else if (userid != null) {



        const duplicateCheck = await userToGroup.findAll({
            where: { userLoginId: userid, groupslistGroupid: req.body.groupid }
        }).then((response) => { return response })
            .catch((err) => {

                return null
            })


        console.log("duplicate check", duplicateCheck.length)

        if (duplicateCheck != undefined && duplicateCheck != null && duplicateCheck.length === 0) {


            await userToGroup.create({
                userLoginId: userid,
                groupslistGroupid: req.body.groupid,
                admin: adminid

            }).then(async () => {

                await chatModel.create(({
                    chat: req.body.username + " Added",
                    userLoginId: userid,
                    groupslistGroupid: req.body.groupid
                })).then(  res.status(200).json({ message: "User Added" }))

               
            })



        } else {
            res.json({ message: "User Already in group" })
        }

    }


}

exports.deleteUser = async (req, res) => {

    const token = req.header("Authorization");
    console.log(token);
    const userid = await dataChecks.tokenAuthentication(token);
    console.log(userid)
    console.log(req.body)

}


exports.fetchuser = async (req, res) => {
    console.log("fetching user", req.body.groupid)

    // await userToGroup.findAll({where : { groupslistGroupid :req.body.groupid  }})
    // .then(response => console.log(response))


    // const chatstore = await chatModel.findAll({
    //     attributes: ['id','chat','groupslistGroupid'],
    //     include: [{ 
    //         model : userloginModel,
    //         attributes : ['name'],
    //         required : true
    //     }],
    //   order : ['id']
    // }).then(response => { return response })

    const users = await userToGroup.findAll({
        attributes: ['userLoginId'],
        where: { groupslistGroupid: req.body.groupid },

    }).then(response => {
        const keys = response.map(id => id.get('userLoginId'))
        return keys;
    })

    console.log(users)

    await userloginModel.findAll({
        where: {
            id: {
                [Op.or]: users
            }
        }
    }
    )
        .then((response) => res.status(200).json({ users: response }))



}


// exports.superuser=async (req,res)=> {

//     const groupid = req.body.groupid
//     const user = req.body.userid
//     const token = req.header("Authorization");
//     console.log(token);
//     const requesterId = await dataChecks.tokenAuthentication(token);

//     const adminData = await userToGroup.findAll({

//         attributes : ['admin'],

//           where : {
//             [Op.and]: [
//                 { groupslistGroupid: groupid },
//               ]    
//           }
//     })
//     .then(response => { 
//         const keys = response.map(id => id.get('admin','userLogins'))
//     return keys;
// }).catch((err)=> console.log(err))


// for ( let i=0;i<adminData.length;i++) {
//     if(adminData[i] == requesterId){
//         await userToGroup.update({
//             admin : user
//         }, 
//         {
//             where : { userLoginId: user, groupslistGroupid:groupid  }

//         })
//         .then(response => {res.json(200).json({ update : response, message : "User added as admin"})})
//         .catch(err=> console.log(err))
//         res.end()
//     }
// }

// // res.status(402).json({message:"You are not Authorised"})


// }



exports.superuser = async (req, res) => {


    const groupid = req.body.groupid
    const user = req.body.userid
    const token = req.header("Authorization");
    console.log(token);
    console.log(req.body)
    const requesterId = await dataChecks.tokenAuthentication(token);

    const findAdmin = await adminFinder(groupid, requesterId)
    // console.log(findAdmin)

    if (findAdmin == null) {
        res.json({ message: "Action Unauthorised" })
    } else {




        const adminCheck = await adminChecker(groupid, user);

        const stringify = JSON.stringify(adminCheck);
        const parsed = JSON.parse(stringify);
        console.log("this is parsed",parsed.admin, "this is user",+user)

        if (+parsed.admin != +user) {
             await userToGroup.update({

                admin: user

            },
                {
                    where: { userLoginId: user, groupslistGroupid: groupid }

                }
            ).then(()=>  res.status(200).json({ message : "Admin Created"}))

        } else 
        if(+parsed.admin === +user){
            res.json({message : "User is already an admin"})
           
        }


    }
}

async function adminFinder(groupid, requesterId) {
    const adminData = await userToGroup.findOne({

        attributes: ['admin'],

        where: {
            [Op.and]: [
                { groupslistGroupid: groupid },
                { admin: requesterId }
            ]
        }
    })
        .then(response => {
            return response
        }).catch((err) => console.log(err))

    return adminData


}
async function adminChecker(groupid, user) {
    const adminCheck = await userToGroup.findOne({
        attributes: ['admin'],
        where: {
            [Op.and]: [
                { groupslistGroupid: groupid },
                { userLoginId: user }
            ]
        }
    }).then(response => {
        console.log("admin check", response)
        return response
    }).catch((err) => console.log(err))

    return adminCheck
}


exports.deleteUser = async(req, res)=> {
    
    const groupid = req.body.groupid
    const user = req.body.userid
    const token = req.header("Authorization");
    console.log(token);
    console.log(req.body.username)
    const requesterId = await dataChecks.tokenAuthentication(token);
const text = req.body.username + " Removed"
console.log(text)
    const findAdmin = await adminFinder(groupid, requesterId)
    console.log(findAdmin)

    if (findAdmin == null) {
        res.json({ message: "Action Unauthorised" })
        console.log("user not authorised")
    } 
    else {
         
        const t = await sequelize.transaction();
        await userToGroup.destroy(
            {
                where: { userLoginId: user, groupslistGroupid: groupid }

            }, { transaction: t }
        ).then(async ()=> {
            console.log(text)
            await chatModel.create({
                chat: text,
                userLoginId: user,
                groupslistGroupid: groupid
            }, { transaction: t }).then(async ()=> {  
                await t.commit()
             res.status(200).json({ message : "User Deleted"})
            }).catch(async (err)=>{
                await t.rollback();
                console.log(err)
            })
        }).catch(async (err)=>{
            await t.rollback();
            console.log(err)
        })

       

    }
}