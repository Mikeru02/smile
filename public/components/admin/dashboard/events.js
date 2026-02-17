import axios from 'axios';
import calculateUptime from '../../../utils/calculateUpTime.js';

export default async function Events(){
    const dashboardInfo = await axios.get(
        '/api/v1/admin/dashboard-info',
        {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_SRC_KEY
            }
        }
    );
    
    const dashboardData = dashboardInfo.data.data;
    console.log(dashboardData)
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
    wasteItemsSpan.textContent = `${dashboardData.waste_transactions}`;

    const paperSpan = document.getElementById('paper');
    paperSpan.textContent = `${dashboardData.paper} items`;
    
    const plasticBottleSpan = document.getElementById('plastic-bottle');
    plasticBottleSpan.textContent = `${dashboardData.plastic_bottle} items`;

    const generalSpan = document.getElementById('general');
    generalSpan.textContent = `${dashboardData.general_waste} items`;

    const binCountSpan = document.getElementById('bin-count');
    binCountSpan.textContent = `${dashboardData.bn_count}`;
}