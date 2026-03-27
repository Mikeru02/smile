import axios from "axios";
import OpenEye from '../../../icons/open-eye.svg';
import CloseEye from '../../../icons/close-eye.svg';
import checkToken from "../../../utils/checkToken.js";
import { validateLoginForm } from "../../../utils/validateInput.js";
import { populateSelect } from "../../../utils/populateSelect.js";
import { SELECT_CONFIG } from "../../../config/selectConfig.js";

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
    const loginBtn = document.getElementById('submit-credential');

    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeIcon.src = type === 'password' ? CloseEye : OpenEye;
        eyeIcon.alt = type === 'password' ? 'Show password' : 'Hide password';
    });


    validateLoginForm(usernameInput, passwordInput, loginBtn);

    usernameInput.addEventListener('input', () => {validateLoginForm(usernameInput, passwordInput, loginBtn);})
    passwordInput.addEventListener('input', () => {validateLoginForm(usernameInput, passwordInput, loginBtn);})

    loginBtn.addEventListener('click', async function() {
        try {
            const response = await axiosClient.post(
                `client/login`,
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