

async function signup(event){
    event.preventDefault();
/**
 * This methods takes the input details and 
 * wraps it in the signupObj and
 * post the obj to the server
 * upon success /failure  prompts the user a message
 */


try{
    const userName = document.getElementById("username").value;
    const emailAdress = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phonenumber").value;
    const password = document.getElementById("password").value;

    const signupObj = {

        userName,
        emailAdress,
        phoneNumber,
        password
    }
    console.log(signupObj)

    await axios.post("http://localhost:4000/user/signup",signupObj)
    .then(response =>{
        console.log(response.data.message);
        document.getElementById("signupresult").innerText = response.data.message
       window.location.href='../signin/signin.html'
    }).catch(err=> {
        document.getElementById("signupresult").innerText = err.response.data.message
        console.log(err.message)
    })
} catch(e){

    console.log(e)
}
    

}




// async function sendtoweb(e){
//     e.preventDefault(); 
// const button = document.getElementById("websocket")

// const ab =button.addEventListener("onsubmit",e=>{
//    return document.getElementById("websocket").value
// })


// console.log(ab)
// }

const socket = io("http://localhost:4000")

socket.on('connect',()=>{
    

    document.getElementById("websocketdisplay").innerText=`${socket.id}`;
    console.log(`${socket.id}`)
   
})
socket.emit("custom",'how you doing bro',2234 )
socket.emit("custom3",'how you doing dudesfsadfasdfas',2234 )

socket.on("custom2",(message)=>{
    document.getElementById("websocketdisplay").innerText=`${message}`;
})



