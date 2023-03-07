

const { all } = require('axios');
const dataChecks = require('../Models/functions')
const groupsModel = require('../Models/groupsListModel')
const userloginModel = require('../Models/loginsmodel');
const sequelize = require('../utility/databaseConnection');




exports.addnewgroup = async (req, res) => {


    const token = req.header("Authorization");
    console.log(token);
    const userid = await dataChecks.tokenAuthentication(token);

    const groupID = dataChecks.generateGroupID();

    const groupnameCheck = await dataChecks.groupnameCheck(req.body.groupname);
    if (groupnameCheck.length == 0) {

        const savegroup = await groupsModel.create({
            groupid: groupID,
            groupname: req.body.groupname,
            groupdesc: req.body.groupdescription,
            admin: userid

        }).then(response => { return response })


        const groupData = await groupsModel.findAll()

        res.status(200).json({ message: "Group Chat Created", list: groupData, currentgroup: savegroup })
    } else {
        res.status(402).json({ message: "A Similar Group Chat Exists..." })
    }


}

exports.adduser = async (req, res, next) => {
    const body = req.body
    // console.log(req.body)

    const answer = await userloginModel.findOne({ where: { name: req.body.username } })
        .then(response => response)


    // console.log("answer is", answer)



    if (answer == null) {
        // console.log("answer is null")
        res.json({ message: "No Such user Exists" })

    } else if (answer != null) {
        

        const stringify = JSON.stringify(answer);
        const parsed = JSON.parse(stringify);
        const groupid = (parsed.groupids)
       if(groupid==null){
        add2Group(body)
       } else if(groupid != null){

        const arr = groupid.split(',')
        // console.log(arr)

        const check = idcheck(arr);


        function idcheck(arr) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == body.groupid) {
                    return true;
                }
            }
        }
        console.log("checking",check)
        if (check == null) {
            const newarr = add2Group(body)
            res.status(200).json({array : newarr, message : "New user added"})

        } else if (check == true) {
            res.json({ message: "User already in the group" })
        }
       }

    }

}

async function add2Group(body) {
    await userloginModel.findOne({ where: { name: body.username } })
        .then((userRecords) => {

            userRecords.update({
                groupids: userRecords.groupids + ',' + `${body.groupid}`
            }).then(response => {
                const newarr = response.groupids.split(',')
                // console.log("new user added")

                return newarr;
               })

            })
        }


