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
    
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Debug: Log the data to ensure all fields are collected
    console.log('Form Data:', data);

    fetch('https://keshvista.pythonanywhere.com/request/', {
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
        alert('Request submitted successfully!');
        console.log('Success:', data);
    })
    .catch(error => {
        alert('There was a problem with your request.');
        console.error('Error:', error.message);
    });
}
