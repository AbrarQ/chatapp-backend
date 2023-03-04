const loginsModel = require('./loginsmodel')

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


module.exports={
    usernameCheck,
    fetchlogins
}