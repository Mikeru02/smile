import axios from 'axios';
import SocketClient from '../../../sockets/socketClient.js';
import { renderEarnTime, renderTimeRemaining } from '../../../utils/render.js';
import checkToken from '../../../utils/checkToken.js';

export default async function Events() {
    const validToken = checkToken(localStorage.getItem('token'));
    if (!validToken) {
        window.app.pushRoute('/');
        return;
    }

    const socketClient = new SocketClient();

    const modal = document.getElementById('modal');

    // Time Containers
    const hoursSpan = document.getElementById('earn-hours-span');
    const minSpan = document.getElementById('earn-min-span');
    const secSpan = document.getElementById('earn-sec-span');
    const TRhoursSpan = document.getElementById('hours-span');
    const TRminSpan = document.getElementById('min-span');
    const TRsecSpan = document.getElementById('sec-span');

    // Polling Interval
    let timeRemainingInterval = null;
    let isConnected = false;

    const connect = document.getElementById('connect');

    // --- Internet Check ---
    let isInternetUp = false;
    const checkInternetConnection = async () => {
        try {
            const response = await axios.get(
                `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/check-internet`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SRC_KEY,
                        'token': localStorage.getItem('token')
                    }
                }
            );
            isInternetUp = response.data.success && response.data.data.internet;
            return isInternetUp;
        } catch (error) {
            console.log('[DEBUG] Internet check error:', error);
            isInternetUp = false;
            return false;
        }
    };

    await checkInternetConnection(); // call once on load

    const updateConnectButtonState = (timeRemainingSeconds) => {
        const isTimeZero = timeRemainingSeconds <= 0;

        if (isTimeZero || !isInternetUp) {
            connect.disabled = true;
            connect.style.opacity = '0.5';
            connect.style.cursor = 'not-allowed';
        } else {
            connect.disabled = false;
            connect.style.opacity = '1';
            connect.style.cursor = 'pointer';
        }
    };

    // Fetch server-side time remaining
    const getServerTimeRemaining = async () => {
        try {
            const response = await axios.get(
                `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/time/time_remaining`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SRC_KEY,
                        'token': localStorage.getItem('token')
                    }
                }
            );
            return response.data.data.time_remaining;
        } catch (err) {
            console.log('[DEBUG] Error fetching time remaining:', err);
            return 0;
        }
    };

    const startTimePolling = () => {
        if (timeRemainingInterval) return;

        timeRemainingInterval = setInterval(async () => {
            if (!isConnected) return;

            const serverTime = await getServerTimeRemaining();
            renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, serverTime);
            updateConnectButtonState(serverTime);

            if (serverTime <= 0) {
                clearInterval(timeRemainingInterval);
                timeRemainingInterval = null;
                connect.textContent = 'Connect';
                isConnected = false;

                // Revoke access on server
                await axios.patch(
                    `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/revoke`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': import.meta.env.VITE_SRC_KEY,
                            'token': localStorage.getItem('token')
                        }
                    }
                );
            }
        }, 1000); // poll every second
    };

    connect.addEventListener('click', async () => {
        if (!isConnected) {
            connect.textContent = 'Pause';
            isConnected = true;

            // Authenticate
            await axios.post(
                `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/auth`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SRC_KEY,
                        'token': localStorage.getItem('token')
                    }
                }
            );

            startTimePolling();

        } else {
            connect.textContent = 'Connect';
            isConnected = false;
            clearInterval(timeRemainingInterval);
            timeRemainingInterval = null;

            // De-authenticate
            await axios.post(
                `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/deauth`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SRC_KEY,
                        'token': localStorage.getItem('token')
                    }
                }
            );

            // fetch server time once on pause
            const serverTime = await getServerTimeRemaining();
            renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, serverTime);
            updateConnectButtonState(serverTime);
        }
    });

    const dropBtn = document.getElementById('start-drop');
    dropBtn.addEventListener('click', async function() {
        modal.style.display = 'block';
        await updateEarnedTimeDisplay();

        socketClient.connect();
        socketClient.on('connect', () => {
            console.log('[SOCKET] connected, waiting for events');
            socketClient.emit('DROPPING');
            socketClient.on('ARDUINO:SONAR', (data) => {
                console.log('SONAR DETECTED', data);
            });
            socketClient.on("EARN", ({earnedTime, wasteCode}) => {
                earn(earnedTime, wasteCode);
            });
        });
    });

    const exit = document.getElementById('exit');
    exit.addEventListener('click', async function() {
        socketClient.disconnect();
        modal.style.display = 'none';
        clearInterval(timeRemainingInterval);
        timeRemainingInterval = null;

        await axios.patch(
            `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/`,
            { status: 'pending' },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );

        // refresh display from server
        const serverTime = await getServerTimeRemaining();
        renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, serverTime);
        updateConnectButtonState(serverTime);
    });

    const proceed = document.getElementById('proceed');
    proceed.addEventListener('click', async function() {
        socketClient.disconnect();
        modal.style.display = 'none';
        clearInterval(timeRemainingInterval);
        timeRemainingInterval = null;

        await axios.post(
            `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/add-time`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );

        const serverTime = await getServerTimeRemaining();
        renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, serverTime);
        updateConnectButtonState(serverTime);

        window.app.pushRoute("/portal");
    });

    const updateEarnedTimeDisplay = async () => {
        const response = await axios.get(
            `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/time/time_earned`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );

        if (!response.data.success) return;

        const earnedSeconds = response.data.data.time_earned;
        renderEarnTime({ hoursSpan, minSpan, secSpan }, earnedSeconds);
    };

    const earn = async (time, wasteCode) => {
        await axios.post(
            `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/earn`,
            { earned_time: time, waste_code: wasteCode },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );

        await updateEarnedTimeDisplay();
    };

    // initialize display
    const initialTime = await getServerTimeRemaining();
    renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, initialTime);
    updateConnectButtonState(initialTime);
    await updateEarnedTimeDisplay();
}