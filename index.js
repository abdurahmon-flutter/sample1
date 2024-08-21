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
    // Get form element
    const form = document.getElementById('requestForm');
    
    // Create a FormData object from the form
    const formData = new FormData(form);
    
    // Convert FormData to a JSON object
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Send the request
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
        // Handle successful response
        alert('Request submitted successfully!');
        console.log('Success:', data);
    })
    .catch(error => {
        // Handle errors
        alert('There was a problem with your request.');
        console.error('Error:', error.message);
    });
}