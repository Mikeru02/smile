import axios from "axios";
import styles from './component.module.css';
import SocketClient from '../../../sockets/socketClient';
import populateDomainListContainer from "../../../utils/populateDomainList";

export default async function PageEvent() {
    const socketClient = new SocketClient();
    socketClient.connect();

    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`

    const response = await axios.get(
        `${baseUrl}/api/v1/admin/prohibited-links`,
        {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SRC_KEY,
                'token': localStorage.getItem('token')
            }
        }
    );

    const prohibitedLinks = response.data.data;
    const domainListContainer = document.getElementById('domain-list');

    domainListContainer.innerHTML = populateDomainListContainer(styles["domain-item"], styles["remove-btn"], prohibitedLinks)

    const removeButtons = document.querySelectorAll(".remove-btn")
    removeButtons.forEach(button => {
        button.addEventListener('click', async function() {
            await axios.delete(
                `${baseUrl}/api/v1/admin/prohibited-links/${button.dataset.id}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SRC_KEY,
                        'token': localStorage.getItem('token')
                    }
                }
            );

            window.app.pushRoute('/admin/settings');
        })
    });

    const addDomainBtn = document.getElementById('add-domain-btn');
    const domainInput = document.getElementById('new-domain');

    addDomainBtn.addEventListener('click', async function() {
        await axios.post(
            `${baseUrl}/api/v1/admin/prohibited-links`,
            { link: domainInput.value },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );
        window.app.pushRoute('/admin/settings');
    })

    const utility = document.getElementById('utility');
    const utilityCheckBox = document.getElementById('utility-checkbox')
    utility.addEventListener('click', async function() {
        utilityCheckBox.checked = true;
        const isChecked = utilityCheckBox.checked;
        window.alert(isChecked);
        socketClient.emit('UTILITY_MODE', ({ isChecked }));
    })
}