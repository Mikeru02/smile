import axios from "axios";
import styles from './component.module.css';
import populateDomainListContainer from "../../../utils/populateDomainList";

export default async function PageEvent() {
    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`

    const response = await axios.get(
        `${baseUrl}/api/v1/link/prohibited/all`,
        {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_SRC_KEY,
                'token': localStorage.getItem('token')
            }
        }
    );
    console.log(response);

    const prohibitedLinks = response.data.data;
    console.log(prohibitedLinks);
    const domainListContainer = document.getElementById('domain-list');

    domainListContainer.innerHTML = populateDomainListContainer(styles["domain-item"], styles["remove-btn"], prohibitedLinks)

    const removeButtons = document.querySelectorAll(".remove-btn")
    removeButtons.forEach(button => {
        button.addEventListener('click', async function() {
            await axios.delete(
                `${baseUrl}/api/v1/admin/prohibited/${button.dataset.id}`,
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
        const isChecked = utilityCheckBox.checked;
        if (isChecked) {
            utilityCheckBox.checked = false;
        } else {
            utilityCheckBox.checked = true;
        }
        
        socketClient.emit('UTILITY_MODE', ({ mode: !isChecked }));
    })
}