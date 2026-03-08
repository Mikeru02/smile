import axios from "axios";
import styles from './component.module.css';
import populateDomainListContainer from "../../../utils/populateDomainList";

export default async function PageEvent() {
    const autoBackupToggle = document.getElementById('auto-backup');
    const frequency = document.getElementById('backup-frequency');
    const compression = document.getElementById('backup-compression');
    const location = document.getElementById('backup-location');
    const retention = document.getElementById('backup-retention');
    
    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1/`,
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
        const settingData = settingResponse.data.data[0];
        console.log("DEBUG", settingData);

        if (settingData.auto_backup) {
            autoBackupToggle.checked = true;
            toggleBackupInputs(autoBackupToggle);
            frequency.value = settingData.backup_freq;
            compression.value = settingData.compression;
            location.value = settingData.location;
            retention.value = settingData.retention;
        }
        else {
            autoBackupToggle.checked = false;
            toggleBackupInputs(autoBackupToggle);
        }
    }
    catch (err) {
        console.error("[ERROR]: ", err);
    }

    function toggleBackupInputs(enabled) {
        frequency.disabled = !enabled;       // select → disabled
        compression.disabled = !enabled;     // select → disabled
        location.readOnly = !enabled;        // input → readOnly
        retention.readOnly = !enabled;       // input → readOnly
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