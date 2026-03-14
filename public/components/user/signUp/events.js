import axios from "axios";
import OpenEye from '../../../icons/open-eye.svg';
import CloseEye from '../../../icons/close-eye.svg';
import checkToken from "../../../utils/checkToken.js";
import { validateSignupForm } from "../../../utils/validateInput.js";

export default async function Events() {
    const axiosClient = axios.create({
        baseURL:`http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1/`,
        headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SRC_KEY
        }
    })
    const validToken = await checkToken(localStorage.getItem('token'));

    if (validToken) {
        window.app.pushRoute('/portal');
    }

    const logo = document.getElementById('logo');
    if (logo) {
        logo.addEventListener('dblclick', () => window.app.pushRoute('/admin/login'));
    }

    const eyeIcon = document.getElementById('eye-icon');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const loginBtn = document.getElementById('submit-credential');
    const consentCheckbox = document.getElementById('consent');

    const toggleButtons = document.querySelectorAll('#toggle-password');
    const eyeIcons = document.querySelectorAll('#eye-icon');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            confirmPasswordInput.type = type;

            eyeIcons.forEach(icon => {
                icon.src = type === 'password' ? CloseEye : OpenEye;
                eyeIcons.alt = type === 'password' ? 'Show password' : 'Hide password';
            })
        })
    })

    // togglePasswordBtn.addEventListener('click', function() {
    //     const confirmPasswordInputType = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    //     const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    //     confirmPasswordInput.setAttribute('type', confirmPasswordInputType);
    //     passwordInput.setAttribute('type', type);
    //     eyeIcon.src = type === 'password' ? CloseEye : OpenEye;
    //     eyeIcon.alt = type === 'password' ? 'Show password' : 'Hide password';
    // });

    validateSignupForm(usernameInput, passwordInput, confirmPasswordInput, consentCheckbox, loginBtn);

    usernameInput.addEventListener('input', () => {validateSignupForm(usernameInput, passwordInput, confirmPasswordInput, consentCheckbox, loginBtn)})
    passwordInput.addEventListener('input', () => {validateSignupForm(usernameInput, passwordInput, confirmPasswordInput, consentCheckbox, loginBtn)})
    confirmPasswordInput.addEventListener('input', () => {validateSignupForm(usernameInput, passwordInput, confirmPasswordInput, consentCheckbox, loginBtn)})
    consentCheckbox.addEventListener('change', () => {validateSignupForm(usernameInput, passwordInput, confirmPasswordInput, consentCheckbox, loginBtn)});

    loginBtn.addEventListener('click', async function() {
        try {
            const response = await axiosClient.post(
                `client/`,
                { username: usernameInput.value, password: passwordInput.value }
            );

            localStorage.setItem('token', response.data.data.token);
            window.app.pushRoute("/portal");
        } 
        catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert(err.message || "An unexpected error occurred");
            }
        }
    });
}