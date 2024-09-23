document.addEventListener("DOMContentLoaded", function() {
    // Check if 'isLogged' is true in local storage
    let typeURL = ''
    const userType = localStorage.getItem('userType');
    
    const isLogged = localStorage.getItem('isLoggedIn') === 'true';
    if(isLogged==true){
        if(userType=="TEACHER"){
            window.location.href = '/teacher';
        }else if(userType=="MAINMANAGER"){
            window.location.href = '/ceo';
        }

    }else{
        window.location.href = '/landing';
    }
});
// document.oncontextmenu = () =>{
//     return false
// }
// document.onkeydown = e =>{
//     if(e.key = "F12"){
//         return false
//     }
// }