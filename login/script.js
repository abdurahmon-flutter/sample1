const container = document.querySelector('.container');
const loginButton = document.querySelector('.login-section header');
const purposeDropdown = document.getElementById("purpose");
const loginBtn = document.getElementById("login-button");
const lcenterpurpose = document.getElementById("lcenterpurpose");
let url_login = "";
let level;
let islcenterselected = false;

// Add class to container on login button click (this might be for some animation or effect)
loginButton.addEventListener('click', () => {
    container.classList.add('active');
});

// Update the URL based on selected purpose


document.addEventListener('DOMContentLoaded', function() {
    purposeDropdown.addEventListener('change', function() {
        const selectedValue = purposeDropdown.value;
        if (selectedValue === "lcenter") {
            lcenterpurpose.style.display = "block";
            islcenterselected = true;
            lcenterpurpose.addEventListener('change', function(){
               const selectLevel  = lcenterpurpose.value;
               if(selectLevel ==="teacher"){
                url_login = Secret.URL+"teachers/";
               }else if(selectLevel ==="main-manager"){
                url_login = Secret.URL+"workers/";
                level = "MAINMANAGER";
               }else if(selectLevel ==="manager"){
                url_login = Secret.URL+"workers/";
                level = "MANAGER";
               }else if(selectLevel ==="admin"){
                url_login = Secret.URL+"workers/";
                level = "ADMIN";
               }
            })
        }else if (selectedValue === "parent") {
            islcenterselected = false;
            lcenterpurpose.style.display = "none";
            url_login = Secret.URL+"parents/";
        }else if (selectedValue==="student"){
            islcenterselected = false;
            lcenterpurpose.style.display = "none";
            url_login = Secret.URL+"students/";
        }
    });
});

// Handle login button click
loginBtn.addEventListener('click', async (event) => {
    event.preventDefault();  // Prevent form submission

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    let isAuthenticated = false;
    let userId;

    if (!url_login) {
        alert('Please select a purpose first.');
        return;
    }

    if(islcenterselected){
        try {
            const response = await fetch(url_login);
            if (response.ok) {
                const adminUsers = await response.json();
    
                for (const user of adminUsers) {
                    if (user.workerRole===level&&user.login === login && user.password === password) {
                        isAuthenticated = true;
                        userId = user.id;
                        userType = user.workerRole;
                        break;
                    }
                }
    
                if (isAuthenticated) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userId', userId);
                    localStorage.setItem("userType",userType)
                    window.location.href = '/'; // Navigate to user screen
                } else {
                    alert('Invalid login or password');
                }
            } else {
                alert('Failed to load users from the server');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('An error occurred while trying to log in');
        }
    }else{
        try {
            const response = await fetch(url_login);
            if (response.ok) {
                const adminUsers = await response.json();
    
                for (const user of adminUsers) {
                    if (user.login === login && user.password === password) {
                        isAuthenticated = true;
                        userId = user.id;
                        userType = user.userType;
                        break;
                    }
                }
    
                if (isAuthenticated) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userId', userId);
                    localStorage.setItem("userType",userType)
                    window.location.href = '/'; // Navigate to user screen
                } else {
                    alert('Invalid login or password');
                }
            } else {
                alert('Failed to load users from the server');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('An error occurred while trying to log in');
        }
    }
});
 document.oncontextmenu = () =>{
            return false
        }
        document.onkeydown = e =>{
            if(e.key === "F12"){
                return false
            }
        }