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

    const connect = document.getElementById('connect');
    let isConnected = false;

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
    await checkInternetConnection();

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

    // Fetch earned time
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

    // --- SOCKET FOR TIME REMAINING ---
    let timeSocketConnected = false;

    const startTimeSocket = async () => {
        if (timeSocketConnected) return;

        socketClient.connect();
        timeSocketConnected = true;

        socketClient.on('connect', async () => {
            console.log('[SOCKET] Time socket connected');
            // Authenticate session
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

            // Tell server to start emitting this client’s remaining time
            socketClient.emit('CLIENT_CONNECTED');

            // Listen for real-time remaining time updates
            socketClient.on('TIME_REMAINING', ({time_remaining}) => {
                renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, time_remaining);
                updateConnectButtonState(time_remaining);

                if (time_remaining <= 0) {
                    connect.textContent = 'Connect';
                    isConnected = false;
                    socketClient.disconnect();
                    timeSocketConnected = false;
                }
            });

            // Optional: Listen for earning events if integrated with Arduino
            socketClient.on('EARN', ({earnedTime, wasteCode}) => {
                earn(earnedTime, wasteCode);
            });
        });
    };

    const stopTimeSocket = async () => {
        if (!timeSocketConnected) return;

        // De-authenticate session
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

        socketClient.disconnect();
        timeSocketConnected = false;

        // Fetch final server time once on pause
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
        const time_remaining = response.data.data.time_remaining;
        renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, time_remaining);
        updateConnectButtonState(time_remaining);
    };

    // --- CONNECT BUTTON ---
    connect.addEventListener('click', async () => {
        if (!isConnected) {
            connect.textContent = 'Pause';
            isConnected = true;
            await startTimeSocket();
        } else {
            connect.textContent = 'Connect';
            isConnected = false;
            await stopTimeSocket();
        }
    });

    // --- INIT ---
    await updateEarnedTimeDisplay();
};