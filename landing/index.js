document.addEventListener("DOMContentLoaded", function() {
    // Check if 'isLogged' is true in local storage
    let typeURL = ''
    const userType = localStorage.getItem('userType');
    
    const isLogged = localStorage.getItem('isLoggedIn') === 'true';
    if(isLogged==true){
        if(userType=="TEACHER"){
            window.location.href = '/teacher';
        }
        
    }
});

const toggler = document.querySelector(".toggler");
const navMenu = document.querySelector("#navMenu");
toggler.addEventListener('click', function () {
    navMenu.classList.toggle("active")
});

const scroll = document.getElementById("scroll");

scroll.addEventListener('click', () => {
    document.querySelector(".get-started").scrollIntoView({ behavior: 'smooth' });
});
const btnreq = document.getElementById("re-button");
btnreq.addEventListener('click', () => {
    document.querySelector(".footer").scrollIntoView({ behavior: 'smooth' });
});

function submitForm() {
    const form = document.getElementById('requestForm');
    const formData = new FormData(form);
    const data = {};
    const submitButton = document.querySelector('.form-request-button');
    const success = document.querySelector('.success');
    
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Change button text to "Yuborilmoqda" when the form is being submitted
    submitButton.textContent = "Yuborilmoqda";
    submitButton.disabled = true;
    console.log('Form Data:', data);

    fetch('https://releasekeshvista.pythonanywhere.com/request/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {throw new Error(text)});
        }
        return response.json();
    })
    .then(data => {
        submitButton.disabled = true;
        form.reset();
        form.style.display = 'none';
        success.style.height = '250px';
        success.style.width = '250px';
        success.style.fontSize = "medium";
        console.log('Success:', data);
    })
    .catch(error => {
        alert('There was a problem with your request.');
        console.error('Error:', error.message);
    })
    .finally(() => {
        // Revert button text back to "Yuborish"
        submitButton.textContent = "Yuborganingiz uchun raxmat!🙋";
        submitButton.disabled = false;
    });
}


