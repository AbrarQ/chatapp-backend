async function newgc(event) {
    event.preventDefault();
    const groupname = document.getElementById("groupname").value;
    const groupdescription = document.getElementById("grouptag").value;


    const groupData = {
        groupname,
        groupdescription
    }



    await axios.post("http://localhost:1000/group/addnewgc", groupData, { headers: { "Authorization": localStorage.getItem("token") } })
        .then(response => { 

            console.log(response.data)
            localStorage.setItem("groupchats", JSON.stringify(response.data.grouplist));
            document.getElementById("groupchatCreationresult").innerText = response.data.message;
            document.getElementById("gclist").innerHTML += `<li id ="${response.data.currentgroup.groupid}"class="list-group-item "><a href ="../chathome/chathome.html">${response.data.currentgroup.groupname}</a></li></form>`
            document.getElementById("groupname").value ="";
            document.getElementById("grouptag").value ="";

        
        })
        

  
}


window.addEventListener("DOMContentLoaded", async () => {


    if (localStorage.getItem("token") == null || undefined) {
        window.location.href = '../signin/signin.html';
    }

    await axios.get("http://localhost:1000/group/getlist",{ headers: { "Authorization": localStorage.getItem("token") } })
        .then(response => { console.log(response.data)
            localStorage.setItem("groupchats", JSON.stringify(response.data.grouplist));})


    if(localStorage.getItem("groupchats")!= undefined || null){
        printgroupslist()

        getdropdown();  
    }
   
})

async function printgroupslist() {
    const chats = JSON.parse(localStorage.getItem("groupchats"))


    if (chats != undefined) {
        for (let i = 0; i < chats.length; i++) {
            document.getElementById("gclist").innerHTML += `<li class="list-group-item "><a href ="../chathome/chathome.html">${chats[i].groupname}</a></li>`
        }
    }
}


function getdropdown() {
    const chats = JSON.parse(localStorage.getItem("groupchats"))

    if (chats != undefined) {
        const parent = document.getElementById("dropdown")

        for (let i = 0; i < chats.length; i++) {
            const option = document.createElement("option");
            option.text = chats[i].groupname;
            option.id = chats[i].groupid;
         
            parent.add(option, parent[i + 1])
        }
    }
}


// var x = document.getElementById("mySelect");
//   var option = document.createElement("option");
//   option.text = "Kiwi";
//   x.add(option, x[2]);

async function adduser(event) {
    event.preventDefault();

    console.log("Adding User")
    const groupindex = document.getElementById("dropdown").selectedIndex

    const groupid =document.getElementById("dropdown")[groupindex].id
    const username = document.getElementById("username").value;
    const phonenumber = document.getElementById("phonenumber").value;




    const userObj = {
        groupid,
        username,
        phonenumber
    }

    console.log(userObj)
    if(userObj.groupid!= ""  &&  userObj.username!="" && userObj.phonenumber!="" ){
const response = await axios.post("http://localhost:1000/group/adduser", userObj,{ headers: { "Authorization": localStorage.getItem("token") } })
.then(response => response)

 document.getElementById("useraddingresult").innerText = response.data.message
    } else {
        document.getElementById("useraddingresult").innerText = "Cannot Send Empty Request"
        console.log(" empty")
    }





}


async function deleteuser (event) {
    event.preventDefault();

    console.log("Deleting User")
    const groupindex = document.getElementById("dropdown").selectedIndex

    const groupid =document.getElementById("dropdown")[groupindex].id
    const username = document.getElementById("username").value;
    const phonenumber = document.getElementById("phonenumber").value;




    const userObj = {
        groupid,
        username,
        phonenumber
    }

    console.log(userObj)
    if(userObj.groupid!= ""  &&  userObj.username!="" && userObj.phonenumber!="" ){
        const response = await axios.post("http://localhost:1000/group/deleteuser", userObj,{ headers: { "Authorization": localStorage.getItem("token") } })
        .then(response => response)
        
         document.getElementById("useraddingresult").innerText = response.data.message
    } else {
        document.getElementById("useraddingresult").innerText = "Cannot Send Empty Request"
        console.log(" empty")
    }







}