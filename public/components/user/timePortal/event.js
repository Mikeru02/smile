import axios from 'axios';
import SocketClient from '../../../sockets/socketClient.js';
import { renderEarnTime, renderTimeRemaining } from '../../../utils/render.js';
import checkToken from '../../../utils/checkToken.js';

export default async function Events() {
    const validToken = checkToken(localStorage.getItem('token'));
    if (!validToken) {
        window.app.pushRoute('/');
    }
    
    const socketClient = new SocketClient();

    // document.body.style.backgroundImage = `url('${BGIMG}')`;

    const modal = document.getElementById('modal');

    // Time Containers
    const hoursSpan = document.getElementById('earn-hours-span');
    const minSpan = document.getElementById('earn-min-span');
    const secSpan = document.getElementById('earn-sec-span');
    const TRhoursSpan = document.getElementById('hours-span');
    const TRminSpan = document.getElementById('min-span');
    const TRsecSpan = document.getElementById('sec-span');

    // Earn Intervals
    let earnInterval = null;
    let timeEarnedResInterval = null;
    let isRunning = false;
    
    //console.log("TIMEEARNEDRES", timeEarnedRes)
    const timeEarned = 10;

    // Time Remaining Intervals
    let timeRemainingSeconds = 0;
    let timeRemainingInterval = null;

    
    const connect = document.getElementById('connect');
    let isConnected = false;
    
    // Check internet connectivity using the same method as admin dashboard
    const checkInternetConnection = async () => {
        try {
            const response = await axios.get(
                `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/admin/dashboard`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SRC_KEY,
                        'token': localStorage.getItem('token')
                    }
                }
            );
            console.log('[DEBUG] Dashboard response:', response.data);
            const internetStatus = response.data.success && response.data.data.internet;
            console.log('[DEBUG] Internet status:', internetStatus);
            return internetStatus;
        } catch (error) {
            console.log('[DEBUG] Internet check error:', error);
            return false;
        }
    };
    
    // Update connect button state
    const updateConnectButtonState = async () => {
        let isInternetUp = false;
        try {
            isInternetUp = await checkInternetConnection();
        } catch (error) {
            console.log('[DEBUG] Error in updateConnectButtonState:', error);
            isInternetUp = false;
        }
        const isTimeZero = timeRemainingSeconds <= 0;
        
        console.log('[DEBUG] Button state check:', {
            isInternetUp,
            timeRemainingSeconds,
            isTimeZero,
            shouldDisable: isTimeZero || !isInternetUp
        });
        
        if (isTimeZero || !isInternetUp) {
            connect.disabled = true;
            connect.style.opacity = '0.5';
            connect.style.cursor = 'not-allowed';
            console.log('[DEBUG] Button disabled');
        } else {
            connect.disabled = false;
            connect.style.opacity = '1';
            connect.style.cursor = 'pointer';
            console.log('[DEBUG] Button enabled');
        }
    };
    
    connect.addEventListener('click', async function() {
        if (!isConnected) {
            connect.textContent = 'Pause';
            isConnected = true;

            startTime();
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
        } else {
            connect.textContent = 'Connect';
            clearInterval(timeRemainingInterval);
            isConnected = false;
            timeRemainingInterval = null;

            // Call disconnect function from main server
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

            updateTimeRemaining();
        }
    });

    const dropBtn = document.getElementById('start-drop');
    dropBtn.addEventListener('click', async function() {
        modal.style.display = 'block';
        updateEarnedTimeDisplay();
        socketClient.connect();
        socketClient.on('connect', () => {
            console.log('[SOCKET] connected, waiting for events')
            socketClient.emit('DROPPING');
            socketClient.on('ARDUINO:SONAR', (data) => {
                console.log('SONAR DETECTED', data);
            });
            socketClient.on("EARN", ({earnedTime, wasteCode}) => {
                earn(earnedTime, wasteCode);
            })
        })
    });

    const exit = document.getElementById('exit');
    exit.addEventListener('click', async function() {
        socketClient.disconnect();
        modal.style.display = 'none';
        clearInterval(earnInterval);
        const response = await axios.patch(
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
        updateTimeRemaining();
    });

    const proceed = document.getElementById('proceed');
    proceed.addEventListener('click', async function() {
        socketClient.disconnect();
        modal.style.display = 'none';
        clearInterval(earnInterval);
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
        updateTimeRemaining();
        window.app.pushRoute("/portal");
    });

    const updateTimeRemaining = async () => {
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
        timeRemainingSeconds = response.data.data.time_remaining;
        const timeRemaining = response.data.data.time_remaining;
        renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, timeRemaining)
        await updateConnectButtonState();
    }

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
        console.log(earnedSeconds);
        renderEarnTime({ hoursSpan, minSpan, secSpan }, earnedSeconds);
    }

    const earn = async (time, wasteCode) => {
        if (isRunning) return;

        isRunning = true;

        await axios.post(`http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/earn`, 
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
    }

    const startTime = () => {
        if (timeRemainingInterval) return;
        timeRemainingInterval = setInterval(async () => {
            if (!isConnected) return;

            if (timeRemainingSeconds <= 0) {
                clearInterval(timeRemainingInterval);
                timeRemainingInterval = null;
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
                connect.textContent = 'Connect';
                isConnected = false;
                return;
            }

            timeRemainingSeconds -= 1;
            renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, timeRemainingSeconds);
            await updateConnectButtonState();
        }, 1000);
    }

    updateTimeRemaining();
    
    // Initial button state check
    updateConnectButtonState();


}