import axios from 'axios';
import OpenEye from '/icons/open-eye.svg';
import CloseEye from '/icons/close-eye.svg';

export default function Events(){
    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`
    const loginBtn = document.getElementById('submit-login');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const okayButton = document.getElementById('ok-button');
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');
    const modal = document.getElementById('modal');
    const messageContainer = document.getElementById('message-container');
    
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        eyeIcon.src = type === 'password' ? CloseEye : OpenEye;
        eyeIcon.alt = type === 'password' ? 'Show password' : 'Hide password';
    });

    okayButton.addEventListener('click', function() {
        modal.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';


    })
    
    loginBtn.addEventListener('click', async function() {
        try {
            const response = await axios.post(
                `${baseUrl}/api/v1/account/login`,
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

            localStorage.setItem('token', response.data.data.token);
            window.app.pushRoute('/admin/dashboard');

        } catch (err) {
            modal.style.display = 'block';
            messageContainer.textContent = err.response?.data?.message || 'Login Failed';
        }
        
    })
}