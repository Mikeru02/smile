import axios from 'axios';

export default function Events(){
    const loginBtn = document.getElementById('submit-login');
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