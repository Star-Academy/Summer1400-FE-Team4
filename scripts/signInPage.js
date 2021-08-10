const user_info = document.getElementById('text_input');
const password = document.getElementById('password_input');
const form = document.getElementById('box');

form.addEventListener('submit', submit);
const user = {};

async function submit(event) {
    event.preventDefault();

    user.password = password.value;
    user.email = '';
    user.username = '';
    if (isValidEmail(user_info.value)) {
        user.email = user_info.value;
    } else {
        user.username = user_info.value;
    }

    const response = await fetch('https://songs.code-star.ir/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(user),
    });
    const result = await response.json();
    if (response.status === 200) {
        localStorage.setItem('authToken', result.token);
        window.location.href = './index.html';
    } else if (response.status === 400) {
        alert('Bad Request!');
    } else if (response.status === 404) {
        alert('User not found!');
        alert(user.email);
    } else {
        alert('Server Error!');
    }
}

function isValidEmail(email) {
    const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
