import axios from "axios";
import styles from './component.module.css';
import populateDomainListContainer from "../../../utils/populateDomainList";

export default async function PageEvent() {
    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SRC_KEY,
        }
    })

    try {
        const prohibitedResponse = await axiosClient.get(
            `link/prohibited/all`,
            {
                headers: {
                    "token": localStorage.getItem("token")
                }
            }
        )
        console.log(prohibitedResponse);
        const prohibitedLinks = prohibitedResponse.data.data;
        console.log(prohibitedLinks);
        const domainListContainer = document.getElementById('domain-list');

        domainListContainer.innerHTML = populateDomainListContainer(styles["domain-item"], styles["remove-btn"], prohibitedLinks)
    }
    catch (err) {
        console.error("[ERROR]: ", err);
    }

    try {
        const settingResponse = await axiosClient.get(
            `setting/`,
            {
                headers: {
                    "token": localStorage.getItem('token')
                }
            }
        )
        const settingData = settingResponse.data.data;
        console.log("DEBUG", settingData);
    }
    catch (err) {
        console.error("[ERROR]: ", err);
    }

    const removeButtons = document.querySelectorAll(".remove-btn")
    removeButtons.forEach(button => {
        button.addEventListener('click', async function() {
            await axios.delete(
                `${baseUrl}/api/v1/link/prohibited/${button.dataset.id}`,
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
            `${baseUrl}/api/v1/link/prohibited`,
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