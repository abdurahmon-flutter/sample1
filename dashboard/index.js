document.addEventListener('DOMContentLoaded', async () => {
    const body = document.body;
    const logo = document.getElementById('logo');
    const profile = document.getElementById('profile');
    const darkThemeLogo = '../logo.png'; // Logo for dark theme
    const lightThemeLogo = '../black_logo_corrected.png';
    const toggler = document.getElementById('theme-toggle');
    const isDarkTheme = toggler ? toggler.checked === false : true;
    const menuBar = document.querySelector('.content nav .bx.bx-menu');
    const sideBar = document.querySelector('.sidebar');
    const searchBtn = document.querySelector('.search-btn'); 
    const searchForm = document.querySelector('.search-form'); 
    const searchBtnIcon = searchBtn.querySelector('.bx'); 

    

    updateTheme(isDarkTheme);

    if (window.innerWidth < 768) {
        sideBar.classList.add('close');
    }

    menuBar.addEventListener('click', () => {
        sideBar.classList.toggle('close');
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            sideBar.classList.add('close');
        } else {
            sideBar.classList.remove('close');
        }

        if (window.innerWidth > 576) {
            searchBtnIcon.classList.replace('bx-x', 'bx-search');
            searchForm.classList.remove('show');
        }
    });

    searchBtn.addEventListener('click', function (e) {
        if (window.innerWidth < 576) {
            e.preventDefault();
            searchForm.classList.toggle('show');
            if (searchForm.classList.contains('show')) {
                searchBtnIcon.classList.replace('bx-search', 'bx-x');
            } else {
                searchBtnIcon.classList.replace('bx-x', 'bx-search');
            }
        }
    });



    await getDocument("dashboard.html");
    await fetchUserData();
    updateDashboardContent();
    

    function updateTheme(isDark) {
        if (isDark) {
            body.classList.add('dark');
            logo.src = darkThemeLogo;
        } else {
            body.classList.remove('dark');
            logo.src = lightThemeLogo;
        }
    }

    if (toggler) {
        toggler.addEventListener('change', function () {
            updateTheme(!this.checked);
        });
    }
});

// Side menu event listeners
const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
const urlMapping = {
    "Dashboard": "dashboard.html",
    "Courses": "navbar-items/courses.html",
    "Analytics": "navbar-items/analytics.html",
    "Tickets": "navbar-items/tickets.html",
    "Users": "navbar-items/users.html",
    "Settings": "navbar-items/settings.html"
};
const userID = localStorage.getItem('userId');
let image, userName, appeal_phone_number, userLocation, bio, manager_name, manager_phone_number, create_date, update_date, manager_password, login, password, userType;
let studentList = [];
let isLoading = false;

sideLinks.forEach(item => {
    const li = item.parentElement;
    item.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevent the default link behavior

        // Remove 'active' class from all menu items
        sideLinks.forEach(i => i.parentElement.classList.remove('active'));

        // Add 'active' class to the clicked menu item
        li.classList.add('active');

        // Update the URL based on the menu item text
        const menuItemText = item.textContent.trim();
        const newUrl = urlMapping[menuItemText];

        if (newUrl) {
            await getDocument(newUrl);
            await fetchUserData();

            if (menuItemText === "Dashboard") {
                updateDashboardContent(); // Ensure the dashboard is properly loaded
            }
        }
    });
});

async function fetchUserData() {
    isLoading=true;
    try {
        const response = await fetch('https://releasekeshvista.pythonanywhere.com/clients/');
        const lcenterdetailsresponse = await fetch('https://releasekeshvista.pythonanywhere.com/lcenterdetail/');
        if (!response.ok && !lcenterdetailsresponse.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const lcenterdetails = await lcenterdetailsresponse.json();
        console.log('API Data:', data); // Log the raw data

        for (const client of data) {
            console.log('Checking client:', client); // Log each client being checked
            if (client.id.toString() === userID) {
                image = client.image;
                userName = client.name;
                appeal_phone_number = client.appeal_phone_number;
                userLocation = client.location;
                bio = client.bio;
                manager_name = client.manager_name;
                manager_phone_number = client.manager_phone_number;
                create_date = client.create_date;
                update_date = client.update_date;
                manager_password = client.manager_password;
                login = client.login;
                password = client.password;
                userType = client.userType;
                break;
            }
        }

        studentList = lcenterdetails.filter(detail => detail.learningCenterId.toString() === userID);
        console.log('StudentList:', studentList);
        if(lcenterdetails&&data){
            isLoading=false;
        };
        
    }catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function getDocument(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            console.log(html); // Log the HTML content
            document.getElementById('item').innerHTML = html;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function updateDashboardContent() {
    const profile = document.getElementById('profile');
    const clientNameElement = document.getElementById('clientName');
    const studentCount = document.getElementById('studentCount');
    if (studentCount) {
        studentCount.textContent = studentList.length; // Use the length property
    }
    if (profile) {
        profile.src = image;
    }

    if (clientNameElement) {
        clientNameElement.textContent = userName;
    } else {
        console.error('Element with ID "clientName" not found.');
    }
    const dashboardContent = document.querySelector(".dashboard-content");
    const loadingContent = document.querySelector(".loading-content");
    // Hide loading content and show dashboard content
    if (loadingContent && dashboardContent) {
        loadingContent.style.display = 'none';
        dashboardContent.style.display = 'block';
    }
}
