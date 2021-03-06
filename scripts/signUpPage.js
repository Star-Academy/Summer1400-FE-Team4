const username = document.getElementById('username_input');
const email = document.getElementById('email_input');
const password = document.getElementById('password_input');
const firstName = document.getElementById('name_input');
const lastName = document.getElementById('lastName_input');
const form = document.getElementById('box');

form.addEventListener('submit', submit);

async function submit(event) {
    event.preventDefault();
    let user = {
        username: username.value,
        email: email.value,
        password: password.value,
        firstName: firstName.value,
        lastName: lastName.value,
    };
    let response = await fetch('https://songs.code-star.ir/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(user),
    });

    const result = await response.json();

    if (response.status === 201) {
        alert('You submitted successfully!');
        localStorage.setItem('authToken', result.token);
        window.location.href = './SignIn.html';
    } else if (response.status === 400) {
        alert(result.message);
    } else {
        console.log(result);
    }
}
