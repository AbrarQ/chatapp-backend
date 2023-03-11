

async function postchat(event) {
    event.preventDefault();


    try {

        const chat = document.getElementById("chatinput").value;


        const groupid = document.getElementsByName("sendbutton")[0].id



        const chatObj = {
            chat,
            groupid
        }
        // console.log(signinObj)

        await axios.post("http://52.72.228.99:4000/chat/postchat", chatObj, { headers: { "Authorization": localStorage.getItem("token") } })
            .then(response => {

                document.getElementById("chatinput").value = "";

            })
            .catch(err => {
                console.log(err)
            })
    } catch (e) {

        console.log(e)
    }


}

async function fetchGroupslist(){
    await axios.get("http://52.72.228.99:4000/group/getlist", { headers: { "Authorization": localStorage.getItem("token") } })
        .then(response => {
            console.log(response.data)
            localStorage.setItem("groupchats", JSON.stringify(response.data.grouplist));
        })

}

async function fetchchats(){

    const response = await axios.get("http://52.72.228.99:4000/chat/getchat", { headers: { "Authorization": localStorage.getItem("token") } })
        .then(response => { return response.data })

    if (response.chats != undefined) {
        const chatbox = response.chats

        if (chatbox.length > 200) {
            localStorage.setItem("chats", JSON.stringify(chatbox.slice(chatbox.length - 200)))
        } else if (chatbox.length < 200) {

            localStorage.setItem("chats", JSON.stringify(chatbox))
        }

    }
    
}

window.addEventListener("DOMContentLoaded", async (event) => {

    event.preventDefault();




    if (localStorage.getItem("token") == null || undefined) {
        window.location.href = '../signin/signin.html';
    }



await fetchGroupslist();
    

    printgroupslist();

    

    await fetchchats()
    printMessages();
}
)



   setInterval(async ()=>{
    console.log("printing at each second")


const chats = JSON.parse(localStorage.getItem("chats"))

const lastmessageid= chats[chats.length-1].id
console.log(lastmessageid)


const response = await axios.get(`http://52.72.228.99:4000/chat/getchat?id=${lastmessageid}&`, {headers :{ "Authorization": localStorage.getItem("token") }})
.then(response =>  (response.data)) 

console.log(response.chats)


    if (response.chats != undefined){
        const chatbox = response.chats

if(chatbox.length>200){
    localStorage.setItem("chats",JSON.stringify(chatbox.slice(chatbox.length-200)))
} else if( chatbox.length < 200){

    localStorage.setItem("chats",JSON.stringify(chatbox))
}

printMessages();

    }else if(response.chats == undefined){
       console.log("All chats Fetched")

    }

},4000)




// this messages will print the messages of the group
function printMessages() {
    console.log("entering pm")


    const chats = JSON.parse(localStorage.getItem("chats"))
    console.log(chats)

    const parent = document.getElementById("messageprinter")

    parent.innerHTML = "";
    for (let i = 0; i < chats.length; i++) {


        if (chats[i].groupslistGroupid == document.getElementsByName("sendbutton")[0].id) {
            parent.innerHTML += ` <div class="message">
            <p class="text-secondary">${chats[i].userLogin.name} : ${chats[i].chat}</p>
        </div>`
        } else {
            continue;
        }

    }

}


// THis fucntion will print the groups list in the left part of the screen

function printgroupslist() {
    const chats = JSON.parse(localStorage.getItem("groupchats"))
    // console.log(chats)

    if (chats != undefined) {
        document.getElementById("gclist").innerHTML = ""
        document.getElementsByName("sendbutton")[0].id = chats[0].groupid;
        for (let i = 0; i < chats.length; i++) {
            document.getElementById("gclist").innerHTML += `<li class="list-group-item"><a href="#" id ="${chats[i].groupid}" onclick="getGroupId(event)" >${chats[i].groupname}</a></li>`;
        }
    }
}

function getGroupId(event) {
    // var text = link.innerHTML;

    document.getElementsByName("sendbutton")[0].id = event.target.id
    printMessages();
    fetchUser( event.target.id);
    console.log(event.target.id)
    const parent = document.getElementById("toggle")
    if (parent.classList.contains('col-md-4', 'mx-auto', 'p-2')) {
        document.getElementById("managesection").innerHTML = ""
        console.log("not coming back")
        parent.classList.remove('col-md-4', 'mx-auto', 'p-2');
        parent.classList.add('col-md-8', 'mx-auto', 'p-2');
    }
    return event.target.id
}


//THis fucntion toggles the classes so that the manage section may appear and disappear on demand

async function toggleClass() {

    const oldClass = "mx-auto p-2 col-md-8"
    const newClass = "mx-auto p-2 col-md-4"






    const parent = document.getElementById("toggle")


    if (parent.classList.contains('col-md-4', 'mx-auto', 'p-2')) {
        document.getElementById("managesection").innerHTML = ""
        console.log("not coming back")
        parent.classList.remove('col-md-4', 'mx-auto', 'p-2');
        parent.classList.add('col-md-8', 'mx-auto', 'p-2');
    } else if (parent.classList.contains('mx-auto', 'p-2', 'col-md-8')) {
        console.log("entering toggle mode")
        parent.classList.remove('mx-auto', 'p-2', 'col-md-8');
        parent.classList.add('col-md-4', 'mx-auto', 'p-2');


         document.getElementById("managesection").innerHTML = '<div class="card"> <div class="card-header text-center" >Add Users </div >   <div class="p-2 input-group mb-3"><span class="input-group-text">User Name :</span> <input type="text" id="username" class="form-control" aria-label="Sizing example input"  aria-describedby="inputGroup-sizing-default" required>   <div class="input-group mb-3"><span class="input-group-text">Phone Number :</span><input type="number" id="phonenumber" class="form-control" aria-label="Sizing example input"aria-describedby="inputGroup-sizing-default" required> </div> <div class="btn p-1 col-12"> <button type="submit" onclick="adduser(event)"  class="btn btn-primary mx-auto"> Add users</button><br></div><br> <p class="text-center fst-italic  mx-auto" id="useraddingresult"></p> </div>       <div class="card-footer text-center" > Manage Users</div > <div id="managechats" class="card-body"><!-- DYNAMIC GROUPS LIST --> <ul id="managelist" class="list-group list-group-flush col-12"></ul></div>  </div>'
   
       
    await usersinGroupPrinting();
    
    
    }



}


//This functions updates the list in manage section, whenever any changes occur like delete or adding

async function usersinGroupPrinting(){
    document.getElementById("managelist").innerHTML= "";
    

    const list =JSON.parse(localStorage.getItem("userslist"));
    console.log(list)
    // <li class="list-group-item ">Abrar</li>
    // const parent =
    // parent.innerHTML ="";
for( let i =0; i<list.length;i++){                                                                                                      
    console.log("entering loop")
    document.getElementById("managelist").innerHTML+= ` <div class ="row"> <li class="list-group-item mt-2 col-13 mx-auto">${list[i].name}</li><div class="col-1"></div> <button type="button" onclick="makehimadmin(event)" id=${list[i].id} class="btn btn-outline-primary col-13 my-auto">Make Admin</button><div class="col-1"></div><button  onclick ="removeuser(event)"type="button" id=${list[i].id} value = ${i} class="btn btn-outline-primary col-13 my-auto">Remove</button></div><br><p  class="text-center fst-italic  mx-auto" id="resultprinting"></p>`



}    

}


//This function will remove a user from the group and update the list in LS by calling a function at last

async function removeuser(event){
    console.log("remove user")
    const groupid = document.getElementsByName("sendbutton")[0].id
    const userid = event.target.id
    console.log(event.target.id, "groupid",groupid)
    const index =event.target.value


    const username = JSON.parse(localStorage.getItem("userslist"))[index].name
console.log(username)
    

    const obj={
        groupid,
        userid,
        username
    }
    document.getElementById("resultprinting").innerText="";



    const response = await axios.post("http://52.72.228.99:4000/group/deleteuser",obj, { headers: { "Authorization": localStorage.getItem("token") } })
    .then(response => { document.getElementById("resultprinting").innerText=response.data.message }).catch((err)=> { return err})
    console.log(response)

    // await fetchGroupslist();
    // await printgroupslist();
    await fetchUser(groupid);
    await usersinGroupPrinting();
    await fetchchats()
    printMessages();

}

//This function will make a user admin of the group 
async function makehimadmin(event){
    console.log("make him admin")
    const groupid = document.getElementsByName("sendbutton")[0].id
    const userid = event.target.id
    console.log(event.target.id, "groupid",groupid)

    const obj={
        groupid,
        userid
    }
    document.getElementById("resultprinting").innerText="";


    const response = await axios.post("http://52.72.228.99:4000/group/superuser",obj, { headers: { "Authorization": localStorage.getItem("token") } })
    .then(response => { document.getElementById("resultprinting").innerText=response.data.message }).catch((err)=> { return err})
    console.log(response)


    await fetchGroupslist();
   await printgroupslist();




}





//This function will add a user to the group and update the list in LS by calling a function at last

async function adduser(event) {
    event.preventDefault();

    // console.log("Adding User")
    

    const groupid = document.getElementsByName("sendbutton")[0].id;

    const username = document.getElementById("username").value;
    const phonenumber = document.getElementById("phonenumber").value;


    const userObj = {
        groupid,
        username,
        phonenumber
    }

    // console.log(userObj)
    if(userObj.groupid!= ""  &&  userObj.username!="" && userObj.phonenumber!="" ){
const response = await axios.post("http://52.72.228.99:4000/group/adduser", userObj,{ headers: { "Authorization": localStorage.getItem("token") } })
.then(response => response)

 document.getElementById("useraddingresult").innerText = response.data.message
    } else {
        document.getElementById("useraddingresult").innerText = "Cannot Send Empty Request"
        console.log(" empty")
    }



await fetchUser(groupid);
await usersinGroupPrinting();
await fetchchats()
printMessages();

}





//This Function will fetch the users in a particular group and store it in LS

async function fetchUser(groupid){
    console.log("groupid")


    const id={
groupid
    }
    

    const response = await axios.post("http://52.72.228.99:4000/group/fetchuser", id)
.then(response => response)
console.log(response.data.users)

 localStorage.setItem("userslist",JSON.stringify(response.data.users))
}


