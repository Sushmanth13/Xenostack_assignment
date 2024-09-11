const BASE_URL = 'http://localhost:4000';

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    const logoutButton = document.getElementById("logoutButton");

    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener("submit", handleSignup);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", handleLogout);
    }

    if (document.getElementById("properties-container")) {
        fetchProperties();
    }
});

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'  // Include cookies if needed
    })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('authToken', data.token);  // Save token to local storage
                alert('Login successful');
                window.location.href = 'index.html';  // Redirect to the property listing page
            } else {
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'  // Include cookies if needed
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'User created successfully') {
                alert('Signup successful');
                window.location.href = 'login.html';  // Redirect to login page
            } else {
                alert('Signup failed: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
}

function fetchProperties() {
    const token = localStorage.getItem('authToken');  // Get token from local storage
    console.log("HERE")
    fetch(`${BASE_URL}/properties`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`  // Send token in Authorization header
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(properties => {
        console.log('Properties fetched:', properties);  // Log the fetched properties
        const container = document.getElementById("properties-container");
        if (!container) return;

        properties.forEach(property => {
            const propertyElement = document.createElement('div');
            propertyElement.classList.add('property');

            propertyElement.innerHTML = `
                <h3>${property.title}</h3>
                <p>Location: ${property.location}</p>
                <p>Price: $${property.price.toLocaleString()}</p>
                <p>Type: ${property.type}</p>
            `;

            container.appendChild(propertyElement);
        });
    })
    .catch(error => {
        console.error('Error fetching properties:', error);
    });
}


function handleLogout() {
    const token = localStorage.getItem('authToken');

    fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(() => {
            localStorage.removeItem('authToken');
            alert('Logged out');
            window.location.href = 'login.html';
        })
        .catch(error => console.error('Error:', error));
}
