import socketClient from "../../../sockets/socketClient.js";
import calculateUptime from '../../../utils/calculateUpTime.js';
import styles from "./component.module.css";

let isInitialized = false;

export default async function Events(){
    if (!isInitialized) {
    let dashboardData;
    socketClient.on('connect', () => {
        console.log('Socket connected');
        socketClient.emit('GET_DASHBOARD_INFO');
    });
    socketClient.on('DASHBOARD_INFO', (data) => {
        dashboardData = data;
        console.log("DASHBOARD: ", dashboardData);
        const uptime = calculateUptime(new Date(dashboardData.server_start_time));
        const daysSpan = document.getElementById('days');
        const hoursSpan = document.getElementById('hours-mins');
        daysSpan.textContent = `${uptime.days}`;
        hoursSpan.textContent = `${uptime.hours} Hours ${uptime.minutes} Minutes`;

        const modelStatSpan = document.getElementById('model-stat');
        const modelSubstatSpan = document.getElementById('model-substat');
        modelStatSpan.textContent = `${dashboardData.model ? 'Connected' : 'Disconnected'}`;
        modelSubstatSpan.textContent = `${dashboardData.model ? 'Model is up and running' : "Can't connect to model"}`;

        const internetStatSpan = document.getElementById('internet-stat');
        const internetSubstatSpan = document.getElementById('internet-substat');
        internetStatSpan.textContent = `${dashboardData.internet ? 'Online' : 'Offline'}`;
        internetSubstatSpan.textContent = `${dashboardData.internet ? 'Internet connection is up and running' : "Can't connect to internet"}`;

        const totalClientsSpan = document.getElementById('total-clients');
        const activeClientsSpan = document.getElementById('active-clients');
        totalClientsSpan.textContent = `${dashboardData.total_clients}`;
        activeClientsSpan.textContent = `${dashboardData.active_clients}`;

        const wasteItemsSpan = document.getElementById('waste-items');
        wasteItemsSpan.textContent = `${dashboardData.waste_transaction}`;

        const paperSpan = document.getElementById('paper');
        paperSpan.textContent = `${dashboardData.paper_transactions} items`;
        
        const plasticBottleSpan = document.getElementById('plastic-bottle');
        plasticBottleSpan.textContent = `${dashboardData.bottles_transaction} items`;

        const generalSpan = document.getElementById('general');
        generalSpan.textContent = `${dashboardData.general_transactions} items`;

        const binCountSpan = document.getElementById('bin-count');
        binCountSpan.textContent = `${dashboardData.bin_count}`;

        const topSites = dashboardData.top_sites || [];

        const topElements = [
            { domain: 'top-first', visits: 'top-first-visit' },
            { domain: 'top-second', visits: 'top-second-visit' },
            { domain: 'top-third', visits: 'top-third-visit' },
        ];

        topElements.forEach((el, index) => {
            const site = topSites[index];
            if (site) {
                document.getElementById(el.domain).textContent = site.domain;
                document.getElementById(el.visits).textContent = site.visits;
            } else {
                document.getElementById(el.domain).textContent = 'N/A';
                document.getElementById(el.visits).textContent = '0';
            }
        });
    })
}
    
    // const dashboardData = dashboardInfo.data.data;
    // console.log(dashboardData)
    // const uptime = calculateUptime(new Date(dashboardData.server_start_time));
    // const daysSpan = document.getElementById('days');
    // const hoursSpan = document.getElementById('hours-mins');
    // daysSpan.textContent = `${uptime.days}`;
    // hoursSpan.textContent = `${uptime.hours} Hours ${uptime.minutes} Minutes`;

    // const modelStatSpan = document.getElementById('model-stat');
    // const modelSubstatSpan = document.getElementById('model-substat');
    // modelStatSpan.textContent = `${dashboardData.model ? 'Connected' : 'Disconnected'}`;
    // modelSubstatSpan.textContent = `${dashboardData.model ? 'Model is up and running' : "Can't connect to model"}`;

    // const internetStatSpan = document.getElementById('internet-stat');
    // const internetSubstatSpan = document.getElementById('internet-substat');
    // internetStatSpan.textContent = `${dashboardData.internet ? 'Online' : 'Offline'}`;
    // internetSubstatSpan.textContent = `${dashboardData.internet ? 'Internet connection is up and running' : "Can't connect to internet"}`;

    // const totalClientsSpan = document.getElementById('total-clients');
    // const activeClientsSpan = document.getElementById('active-clients');
    // totalClientsSpan.textContent = `${dashboardData.total_clients}`;
    // activeClientsSpan.textContent = `${dashboardData.active_clients}`;

    // const wasteItemsSpan = document.getElementById('waste-items');
    // wasteItemsSpan.textContent = `${dashboardData.waste_transactions}`;

    // const paperSpan = document.getElementById('paper');
    // paperSpan.textContent = `${dashboardData.paper} items`;
    
    // const plasticBottleSpan = document.getElementById('plastic-bottle');
    // plasticBottleSpan.textContent = `${dashboardData.plastic_bottle} items`;

    // const generalSpan = document.getElementById('general');
    // generalSpan.textContent = `${dashboardData.general_waste} items`;

    // const binCountSpan = document.getElementById('bin-count');
    // binCountSpan.textContent = `${dashboardData.bin_count}`;

    // const topSites = dashboardData.top_sites || [];

    // const topElements = [
    //     { domain: 'top-first', visits: 'top-first-visit' },
    //     { domain: 'top-second', visits: 'top-second-visit' },
    //     { domain: 'top-third', visits: 'top-third-visit' },
    // ];

    // topElements.forEach((el, index) => {
    //     const site = topSites[index];
    //     if (site) {
    //         document.getElementById(el.domain).textContent = site.domain;
    //         document.getElementById(el.visits).textContent = site.visits;
    //     } else {
    //         document.getElementById(el.domain).textContent = 'N/A';
    //         document.getElementById(el.visits).textContent = '0';
    //     }
    // });
}