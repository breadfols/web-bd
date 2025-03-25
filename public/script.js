document.getElementById('Button').addEventListener('click', function () {
    document.getElementById('loginError').textContent = '';
    document.getElementById('passError').textContent = '';

    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;



    let hasError = false;
    if (login.trim() === '') {
        document.getElementById('loginError').textContent = 'Поле логина не может быть пустым.';
        hasError = true;
    }
    if (password.trim() === '') {
        document.getElementById('passError').textContent = 'Поле пароля не может быть пустым.';
        hasError = true;
    }

    if (!hasError) {

        console.log('Логин:', login);

        console.log('Пароль:', password);

    }
});
const togglePasswordButton = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePasswordButton.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    togglePasswordButton.classList.toggle('hidden');
});