import { apiPost, Page } from './page.js';
import { ApiError } from './page.js';

let name = document.getElementById('name');
let userName = document.getElementById('userName');
let email = document.getElementById('email');
let image = document.getElementById('image');
let emptyAvatar = document.getElementById('emptyAvatar');

const userNameInput = document.getElementById('username_input');
const emailInput = document.getElementById('email_input');
const passwordInput = document.getElementById('password_input');
const firstNameInput = document.getElementById('name_input');
const lastNameInput = document.getElementById('lastName_input');
const form = document.getElementById('box');

const page = new Page();

try {
    page.updatePage();
    let user = await page.getCurrentUser();

    if (user.avatar === null) {
    } else {
        image.src = user.avatar;
        image.classList.remove('hidden');
        emptyAvatar.classList.add('hidden');
    }
    name.innerText = user.first_name;
    userName.innerText = user.username;
    email.innerText = user.email;

    form.addEventListener('submit', submit);

    async function submit(event) {
        event.preventDefault();

        user.firstName = firstNameInput.value;
        user.lastName = lastNameInput.value;
        user.email = emailInput.value;
        user.password = passwordInput.value;
        user.username = userNameInput.value;
        user.token = page.authToken;
        await apiPost('user/alter', user);
    }
} catch (e) {
    if (e instanceof ApiError) alert(e.message);
    throw e;
}
