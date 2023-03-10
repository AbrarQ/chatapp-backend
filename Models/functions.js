const loginsModel = require('./loginsmodel')
const jwt = require('jsonwebtoken');
const groupsListModel = require("../Models/groupsListModel");
const userloginModel = require('../Models/loginsmodel')


async function usernameCheck(email){
    console.log("Entering username Check",email)
    const loginData = await loginsModel.findAll({ where : { email : email }})
    .then(result => result)
    console.log("usernamecheck is ", loginData.length)
    if(loginData == undefined || loginData == null || loginData.length == 0){
        return false
    } else{
        return true;
    }
}

async function fetchlogins(email){
    console.log("Fetching logins",email)
    const loginData = await loginsModel.findAll({ where : { email : email }})
    .then(result => result)
    console.log("login data is ", loginData.length)
    if(loginData == undefined || loginData == null || loginData.length == 0){
        return false
    } else{
        return loginData;
    }
}



 function tokenAuthentication( token ){
// console.log(token)
    const verify = jwt.verify(token,process.env.jwtSecretKey)
    return verify.id

}

 function generateGroupID(){
    const val = Math.floor(1000 + Math.random() * 9000);
    return val;
    
}

async function groupnameCheck(groupName){
console.log("entering gc name check")    
  const data =  await groupsListModel.findAll({where : {groupname : `${groupName}`}})
    .then(response => {return response})

    const a = JSON.stringify(data);
    const b = JSON.parse(a);
    
    
    return b;

   

}

async function usercheck(username){
    console.log("entering gc name check")    
      const data = await userloginModel.findOne({where : {name : username}})
        .then(response => {return response})
    
        const a = JSON.stringify(data);
        const b = JSON.parse(a);
        // console.log(b)
        
        return b;
    
       
    
    }

module.exports={
    usernameCheck,
    fetchlogins,
    tokenAuthentication,
    generateGroupID,
    groupnameCheck,
    usercheck
}