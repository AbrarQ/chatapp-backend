const loginsModel = require('./loginsmodel')
const jwt = require('jsonwebtoken');
const groupsListModel = require("../Models/groupsListModel");
const userloginModel = require('../Models/loginsmodel')
const aws = require('aws-sdk')
require("aws-sdk/lib/maintenance_mode_message").suppress = true;


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





async function uploadToS3(data, filename) {
    try{
      const BUCKET_NAME = process.env.BUCKET_NAME;
      const IAM_USER_KEY = process.env.IAM_USER_KEY;
      const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
  
  
  
      let s3Bucket =  new aws.S3 ({
          accessKeyId: IAM_USER_KEY,
          secretAccessKey : IAM_USER_SECRET,
          // Bucket : BUCKET_NAME
      })
  var params = {
              Bucket : BUCKET_NAME,
              Key : filename,
              Body : data,
              ACL : ' public-read'
  
          }
          return new Promise((resolve,reject)=>{
              s3Bucket.upload(params,async(err,s3response)=>{
                  if (err){
                      console.log("AWS ERROR",err)
                      reject(err)
                  } else {
                      console.log("AWS success",s3response)
                       resolve  (s3response.Location);
                  }
              })
          })
    } catch(err){
      console.log(err)
      
    }
          
      } 


module.exports={
    usernameCheck,
    fetchlogins,
    tokenAuthentication,
    generateGroupID,
    groupnameCheck,
    usercheck,
    uploadToS3
}

