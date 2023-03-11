async function signin(event){
    event.preventDefault();
/**
 * This methods takes the input details and 
 * wraps it in the signinObj and
 * post the obj to the server
 * upon success /failure  prompts the user a message
 */


try{
   
    const emailAdress = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const signinObj = {
        emailAdress,
        password
    }
    // console.log(signinObj)

    await axios.post("http://localhost:1000/user/signin",signinObj)
    .then(response =>{
       console.log(response)
        document.getElementById("signinresult").innerText = response.data.message      
        document.getElementById("email").value = ""
        document.getElementById("password").value = ""

        if(response.status === 200){

            localStorage.setItem("token",response.data.token)
            console.log("200")
        }

        window.location.href='../chathome/chathome.html'

    
    }).catch(err=> {
        // document.getElementById("signinresult").innerText = err.response.data.message 
        console.log(err)
    })
} catch(e){

    console.log(e)
}
    

}