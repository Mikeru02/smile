import axios from 'axios';
import SocketClient from '../../../sockets/socketClient.js';
import { renderEarnTime, renderTimeRemaining } from '../../../utils/render.js';
import checkToken from '../../../utils/checkToken.js';
import { getRole } from '../../../utils/getRole.js';

export default async function Events() {    
    const token = localStorage.getItem('token')
    const validToken = checkToken(token);
    const role = getRole(token);

    if (!validToken) {
        window.app.pushRoute('/');
        return;
    }

    if (role === 'admin') {
        window.app.pushRoute('/admin/dashboard');
        return;
    }
    
    const socketClient = new SocketClient();
    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`
    socketClient.connect();
    socketClient.on('connect', () => {
        console.log('[SOCKET] connected, waiting for events');
    })
    

    const modal = document.getElementById('modal');
    const droppingModal = document.getElementById('dropping-modal');

    // Time Containers
    const hoursSpan = document.getElementById('earn-hours-span');
    const minSpan = document.getElementById('earn-min-span');
    const secSpan = document.getElementById('earn-sec-span');
    const TRhoursSpan = document.getElementById('hours-span');
    const TRminSpan = document.getElementById('min-span');
    const TRsecSpan = document.getElementById('sec-span');

    // Earn Intervals
    let earnInterval = null;
    let isRunning = false;
    let dropTimeout = null;
    let countdownInterval = null;
    const dropTimeoutSec = 60;
    
    // Time Remaining Intervals
    let timeRemainingSeconds = 0;
    let timeRemainingInterval = null;

    const connect = document.getElementById('connect');
    let isConnected = false;

    const handleSonar = (data) => {
        console.log("SONAR DETECTED", data);
        startDropTimeout();
    }

    const handleEarn = ({ earnedTime, wasteCode }) => {
        earn(earnedTime, wasteCode);
    }

    const handleDropFinished = () => {
        modal.style.display = 'none';
        clearInterval(earnInterval);
        stopDropListeners();
        updateTimeRemaining();
    }

    const startDropListeners = () => {
        socketClient.on('ARDUINO:SONAR', handleSonar);
        socketClient.on('EARN', handleEarn);
        socketClient.on('DROP_FINISHED', handleDropFinished);
    }

    const stopDropListeners = () => {
        socketClient.off('ARDUINO:SONAR', handleSonar);
        socketClient.off('EARN', handleEarn);
        socketClient.off('DROP_FINISHED', handleDropFinished);
    }

    // --- Internet Check (once) ---
    let isInternetUp = false;
    socketClient.emit('CHECK_INTERNET');
    socketClient.on('INTERNET_STATUS', (data) => {
        isInternetUp = data.online;
    })

    const updateConnectButtonState = () => {
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

    connect.addEventListener('click', async function() {
        if (!isConnected) {
            connect.textContent = 'Pause';
            isConnected = true;
            startTime();
            socketClient.emit('AUTH_CLIENT');
        } else {
            connect.textContent = 'Connect';
            clearInterval(timeRemainingInterval);
            isConnected = false;
            timeRemainingInterval = null;
            socketClient.emit('DEAUTH_CLIENT')
            updateTimeRemaining();
        }
    });

    const dropBtn = document.getElementById('start-drop');
    dropBtn.addEventListener('click', async function() {
        const droppingClientData = await new Promise(resolve => {
            socketClient.once('DROPING_CLIENT_DATA', (data) => {
                resolve(data);
            })
            socketClient.emit('DROPPING_CLIENT');
        })
        
        if (droppingClientData.length <= 0){
            modal.style.display = 'block';
            startDropTimeout();
            updateEarnedTimeDisplay();
            startDropListeners();
            socketClient.emit('DROPPING');
        } else {
            droppingModal.style.display = 'block';
        }
    });

    const okBtn = document.getElementById('ok-button');
    okBtn.addEventListener('click', function() {
        droppingModal.style.display = 'none';
    })

    const exit = document.getElementById('exit');
    exit.addEventListener('click', async function() {
        socketClient.emit('DROP_COMPLETE');
        stopDropListeners();
        modal.style.display = 'none';
        clearInterval(earnInterval);
        updateTimeRemaining();
    });

    const proceed = document.getElementById('proceed');
    proceed.addEventListener('click', async function() {
        socketClient.emit('DROP_COMPLETE');
        stopDropListeners();
        modal.style.display = 'none';
        clearInterval(earnInterval);
        await axios.post(
            `${baseUrl}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/add-time`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );
        updateTimeRemaining();
        window.app.pushRoute("/portal");
    });

    const updateTimeRemaining = async () => {
        const response = await axios.get(
            `${baseUrl}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/time/time_remaining`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );
        timeRemainingSeconds = response.data.data.time_remaining;
        renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, timeRemainingSeconds);
        updateConnectButtonState();
    };

    const getClientStatus = async () => {
        const response = await axios.get(
            `${baseUrl}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );
        return response.data.data;
    };

    const getActualTimeRemaining = async () => {
        const response = await axios.get(
            `${baseUrl}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/time/calculated`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );
        return response.data.data.time_remaining;
    };

    const updateEarnedTimeDisplay = async () => {
        const earnedSeconds = await new Promise(resolve => {
            socketClient.once('TIME_EARNED', (data) => {
                resolve(data.timeEarned)
            });
            socketClient.emit('GET_TIME_EARNED');
        });

        renderEarnTime({ hoursSpan, minSpan, secSpan }, earnedSeconds);
    };

    const earn = async (time, wasteCode) => {
        if (isRunning) return;

        isRunning = true;

        await axios.post(
            `${baseUrl}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/earn`,
            { earned_time: time, waste_code: wasteCode },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
                }
            }
        );

        updateEarnedTimeDisplay();
        isRunning = false;
    };

    const startTime = () => {
        if (timeRemainingInterval) return;
        timeRemainingInterval = setInterval(async () => {
            if (!isConnected) return;

            if (timeRemainingSeconds <= 0) {
                clearInterval(timeRemainingInterval);
                timeRemainingInterval = null;
                await axios.patch(
                    `${baseUrl}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/revoke`,
                    {},
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': import.meta.env.VITE_SRC_KEY,
                            'token': localStorage.getItem('token')
                        }
                    }
                );
                connect.textContent = 'Connect';
                isConnected = false;
                return;
            }

            timeRemainingSeconds -= 1;
            renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, timeRemainingSeconds);
            updateConnectButtonState();
        }, 1000);
    };

    const startDropTimeout = () => {
        if (dropTimeout) clearTimeout(dropTimeout);
        if (countdownInterval) clearInterval(countdownInterval);

        // Reset visual timer
        const timerElement = document.getElementById('countdown-timer');
        if (timerElement) {
            timerElement.textContent = dropTimeoutSec;
        }

        // Start visual countdown
        let timeLeft = dropTimeoutSec;
        countdownInterval = setInterval(() => {
            timeLeft--;
            if (timerElement) {
                timerElement.textContent = timeLeft;
            }
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
        }, 1000);

        dropTimeout = setTimeout(async () => {
            console.log("TIMEOUT TRIGGERED");
            modal.style.display = 'none';
            socketClient.emit('DROP_COMPLETE');
            stopDropListeners();
            clearInterval(earnInterval);
            if (countdownInterval) clearInterval(countdownInterval);
            dropTimeout = null;
            countdownInterval = null;
            await axios.patch(
                `${baseUrl}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/`,
                { status: 'pending' },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SRC_KEY,
                        'token': localStorage.getItem('token')
                    }
                }
            );
            updateTimeRemaining();
            }, dropTimeoutSec * 1000)
    }

    await updateTimeRemaining(); // initialize
    updateConnectButtonState();  // initial button state
    
    // Check and restore connection state if client is still active
    const clientData = await getClientStatus();
    if (clientData.status === 'active') {
        // Get the actual calculated time remaining
        const actualTimeRemaining = await getActualTimeRemaining();
        timeRemainingSeconds = actualTimeRemaining;
        renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, timeRemainingSeconds);
        
        if (timeRemainingSeconds > 0) {
            isConnected = true;
            connect.textContent = 'Pause';
            startTime(); // Restart the timer
        }
    }
}