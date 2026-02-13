import axios from 'axios';
import OpenEye from '/icons/open-eye.svg';
import CloseEye from '/icons/close-eye.svg';

export default function Events(){
    const loginBtn = document.getElementById('submit-login');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeIcon.src = type === 'password' ? CloseEye : OpenEye;
        eyeIcon.alt = type === 'password' ? 'Show password' : 'Hide password';
    });
    
    loginBtn.addEventListener('click', async function() {
        const response = await axios.post(
            `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/account/login`,
            {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                }
            }
        );
        console.log(response.data);
        localStorage.setItem('token', response.data.data.token);
        window.app.pushRoute('/admin/dashboard')
    })
}