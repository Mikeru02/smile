import axios from "axios";
import styles from './component.module.css';
import populateDomainListContainer from "../../../utils/populateDomainList";
import socketClient from "../../../sockets/socketInstance";

export default async function PageEvent() {
    const backupCheckbox = document.getElementById('backup-checkbox');
    const autoBackupToggle = document.getElementById('auto-backup');
    const frequency = document.getElementById('backup-frequency');
    const compression = document.getElementById('backup-compression');
    const location = document.getElementById('backup-location');
    const retention = document.getElementById('backup-retention');
    const utility = document.getElementById('utility');
    const utilityCheckBox = document.getElementById('utility-checkbox');

    const axiosClient = axios.create({
        baseURL: `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/v1/`,
        headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SRC_KEY,
        }
    })

    socketClient.off("SET_UTILITY_MODE");
    socketClient.on("SET_UTILITY_MODE", (data) => {
        const mode = data.mode;
        if (mode) {
            utilityCheckBox.checked = true;
        }
        else {
            utilityCheckBox.checked = false;
        }

    });

    socketClient.off("PROHIBITED");
    socketClient.on("PROHIBITED", (data) => {
        const prohibitedLinks = data.links;
        console.log(prohibitedLinks);
        const domainListContainer = document.getElementById('domain-list');
        domainListContainer.innerHTML = populateDomainListContainer(styles["domain-item"], styles["remove-btn"], prohibitedLinks)
    })

    function toggleBackupInputs(enabled) {
        // Select elements
        const inputs = [
            { el: frequency, isSelect: true },
            { el: compression, isSelect: true },
            { el: location, isSelect: false },
            { el: retention, isSelect: false }
        ];

        inputs.forEach(({ el, isSelect }) => {
            if (enabled) {
                if (isSelect) el.disabled = false;
                else el.readOnly = false;

                el.style.cursor = 'auto';
                el.style.opacity = '1';
            } else {
                if (isSelect) el.disabled = true;
                else el.readOnly = true;

                el.style.cursor = 'not-allowed';
                el.style.opacity = '0.6';
            }
        });
    }

    // try {
    //     const prohibitedResponse = await axiosClient.get(
    //         `link/prohibited/all`,
    //         {
    //             headers: {
    //                 "token": localStorage.getItem("token")
    //             }
    //         }
    //     )
    //     const prohibitedLinks = prohibitedResponse.data.data;
    //     console.log(prohibitedLinks);
    //     const domainListContainer = document.getElementById('domain-list');

    //     domainListContainer.innerHTML = populateDomainListContainer(styles["domain-item"], styles["remove-btn"], prohibitedLinks)
    // }
    // catch (err) {
    //     console.error("[ERROR]: ", err);
    // }

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
        frequency.value = settingData.backup_freq;
        compression.value = settingData.compression;
        location.value = settingData.location;
        retention.value = settingData.retention;

        if (settingData.utility_mode) {
            utilityCheckBox.checked = true;
            socketClient.emit('UTILITY_MODE', ({ mode: utilityCheckBox.checked }));
        }
        else {
            utilityCheckBox.checked = false;
            socketClient.emit('UTILITY_MODE', ({ mode: utilityCheckBox.checked }));
        }

        if (settingData.auto_backup) {
            backupCheckbox.checked = true;
            toggleBackupInputs(backupCheckbox.checked);
        }
        else {
            backupCheckbox.checked = false;
            toggleBackupInputs(backupCheckbox.checked);
        }
    }
    catch (err) {
        console.error("[ERROR]: ", err);
    }

    const removeButtons = document.querySelectorAll(".remove-btn")
    removeButtons.forEach(button => {
        button.addEventListener('click', async function() {
            socketClient.emit("REMOVE_PROHIBITED", ({ id: button.dataset.id }))
            // await axiosClient.delete(
            //     `link/prohibited/${button.dataset.id}`,
            //     {
            //         headers: {
            //             'token': localStorage.getItem('token')
            //         }
            //     }
            // );

            // window.app.pushRoute('/admin/settings');
        })
    });

    const addDomainBtn = document.getElementById('add-domain-btn');
    const domainInput = document.getElementById('new-domain');

    addDomainBtn.addEventListener('click', async function() {
        const domain = domainInput.value.trim();
        if (!domain) {
            alert("Please enter a domain"); // optional feedback
            return;
        }
        socketClient.emit('SET_PROHIBITED', ({ domain: domain }));
        domainInput.value = "";
    })

    autoBackupToggle.addEventListener('click', async () => {
        const isChecked = backupCheckbox.checked;
        if (isChecked) {
            backupCheckbox.checked = false;
        }
        else {
            backupCheckbox.checked = true;
        }
        toggleBackupInputs(backupCheckbox.checked);

        await axiosClient.patch(
            `setting/`,
            { auto_backup: backupCheckbox.checked },
            {
                headers: {
                    "token": localStorage.getItem("token")
                }
            }
        )
    });

    utility.addEventListener('click', async function() {
        const isChecked = utilityCheckBox.checked;
        await axiosClient.patch(
            `setting/`,
            { utility_mode: !isChecked },
            {
                headers: {
                    "token": localStorage.getItem("token")
                }
            }
        )
        socketClient.emit('UTILITY_MODE', ({ mode: !isChecked }));
    })
}