document.addEventListener("DOMContentLoaded", function() {
    // Check if 'isLogged' is true in local storage
    let typeURL = ''
    const userType = localStorage.getItem('userType');
    
    const isLogged = localStorage.getItem('isLoggedIn') === 'true';
    if(isLogged==true){
        if(userType=="TEACHER"){
            window.location.href = '/teacher';
        }else if(userType=="LCENTER"){
            window.location.href = '/managment';
        }

    }else{
        window.location.href = '/landing';
    }
});