const container = document.querySelector('.container');
const loginButton = document.querySelector('.login-section header');
const purposeDropdown = document.getElementById("purpose");
const loginBtn = document.getElementById("login-button");
let url_login = "";

// Add class to container on login button click (this might be for some animation or effect)
loginButton.addEventListener('click', () => {
    container.classList.add('active');
});

// Update the URL based on selected purpose
document.addEventListener('DOMContentLoaded', function() {
    purposeDropdown.addEventListener('change', function() {
        const selectedValue = purposeDropdown.value;
        if (selectedValue === "lcenter") {
            url_login = "https://releasekeshvista.pythonanywhere.com/clients/";
        } else if (selectedValue === "teacher") {
            url_login = "https://releasekeshvista.pythonanywhere.com/teachers/";
        } else if (selectedValue === "parent") {
            url_login = "https://releasekeshvista.pythonanywhere.com/parents/";
        }
    });
});

// Handle login button click
loginBtn.addEventListener('click', async (event) => {
    event.preventDefault();  // Prevent form submission

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    let isAuthenticated = false;
    let userId, userName;

    if (!url_login) {
        alert('Please select a purpose first.');
        return;
    }

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
});
