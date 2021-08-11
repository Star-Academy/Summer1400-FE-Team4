import { apiPost, Page } from './page.js';
import { ApiError } from './page.js';

const name = document.getElementById('name');
const userName = document.getElementById('userName');
const email = document.getElementById('email');
const image = document.getElementById('image');
const emptyAvatar = document.getElementById('emptyAvatar');

const imageInput = document.getElementById('image_input');
const removeAvatar = document.getElementById('removeAvatar');
const userNameInput = document.getElementById('username_input');
const emailInput = document.getElementById('email_input');
const passwordInput = document.getElementById('password_input');
const firstNameInput = document.getElementById('name_input');
const lastNameInput = document.getElementById('lastName_input');
const form = document.getElementById('box');

const page = new Page();
let avatar = 'null';

try {
    if ((await page.getUserId()) === null) location.href = 'index.html';
    else {
        page.updatePage();
        page.updateTitle('ویرایش حساب کاربری');
        let user = await page.getCurrentUser();

        if (user.avatar !== null && user.avatar !== 'null') {
            image.src = user.avatar;
            image.classList.remove('hidden');
            emptyAvatar.classList.add('hidden');
        }
        name.innerText = user.first_name + ' ' + user.last_name;
        userName.innerText = '@' + user.username;
        email.innerText = user.email;

        form.addEventListener('submit', submit);

        imageInput.onchange = (file) => {
            var input = file.target;

            var reader = new FileReader();
            reader.onload = function () {
                var dataURL = reader.result;
                image.src = avatar = dataURL;
                emptyAvatar.classList.add('hidden');
                image.classList.remove('hidden');
            };
            reader.readAsDataURL(input.files[0]);
        };

        removeAvatar.addEventListener('click', (event) => {
            event.preventDefault();

            emptyAvatar.classList.remove('hidden');
            image.classList.add('hidden');
            avatar = 'null';
        });

        async function submit(event) {
            event.preventDefault();

            let user = {};
            user.firstName = firstNameInput.value;
            user.lastName = lastNameInput.value;
            user.email = emailInput.value;
            user.password = passwordInput.value;
            user.username = userNameInput.value;
            user.token = page.authToken;
            user.avatar = avatar;

            try {
                await apiPost('user/alter', user, false);
                location.reload();
            } catch (e) {
                if (e instanceof ApiError) alert(e.message);
                else alert('مشکلی در ارتباط با سرور به وجود آمده');
                throw e;
            }
        }
    }
} catch (e) {
    if (e instanceof ApiError) alert(e.message);
    throw e;
}
