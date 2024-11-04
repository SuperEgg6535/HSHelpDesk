function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById('reg-name').value;
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const Admin = document.getElementById('admin').checked; // Get the admin status

    if (username && password && name) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert('Username already exists!');
        } else {
            // Add new user with admin status
            users.push({ name, username, password, Admin });
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! You can now log in.');
            document.getElementById('registration-form').reset();
        }
    } else {
        alert('Please fill in all fields');
    }
}



function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username && password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            // Save login state in local storage
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            document.getElementById('login-message').textContent = 'Login successful!';

            // Redirect based on user role
            if (user.Admin) {
                window.location.href = 'loginpage.html'; // Admin page
            } else {
                window.location.href = 'index.html'; // Normal user page
            }
        } else {
            document.getElementById('login-message').textContent = 'Invalid username or password';
        }
    } else {
        alert('Please enter both username and password');
    }
}


// Optional: Logout function to clear login state
function logoutUser() {
    localStorage.removeItem('loggedInUser');
    document.getElementById('login-message').textContent = 'You have been logged out';
    window.location.href = 'reg_user.html'; 
}

