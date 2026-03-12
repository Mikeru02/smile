import axios from "axios";
import OpenEye from '../../../icons/open-eye.svg';
import CloseEye from '../../../icons/close-eye.svg';
import checkToken from "../../../utils/checkToken.js";
import { validateSignupForm } from "../../../utils/validateInput.js";
import { populateSelect } from "../../../utils/populateSelect.js";
import { SELECT_CONFIG } from "../../../config/selectConfig.js";

export default async function Events() {
    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`;
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
    const loginBtn = document.getElementById('submit-credential');
    const consentCheckbox = document.getElementById('consent');


    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeIcon.src = type === 'password' ? CloseEye : OpenEye;
        eyeIcon.alt = type === 'password' ? 'Show password' : 'Hide password';
    });

    validateSignupForm(usernameInput, passwordInput, consentCheckbox, loginBtn);

    usernameInput.addEventListener('input', () => {validateSignupForm(usernameInput, passwordInput, consentCheckbox, loginBtn);})
    passwordInput.addEventListener('input', () => {validateSignupForm(usernameInput, passwordInput, consentCheckbox, loginBtn);})
    consentCheckbox.addEventListener('change', () => {validateSignupForm(usernameInput, passwordInput, consentCheckbox, loginBtn)});
}