import SocketClient from '../../../sockets/socketClient.js';
import { renderEarnTime, renderTimeRemaining } from '../../../utils/render.js';
import checkToken from '../../../utils/checkToken.js';
import { getRole } from '../../../utils/getRole.js';

export default function Events() {
    const token = localStorage.getItem('token');
    const validToken = checkToken(token);
    const role = getRole(token);

    // Intervals
    let timeEarned = 0;
    let earnInterval = null;
    let isRunning = false;
    let dropTimeout = null;
    let countdownInterval = null;
    const dropTimeoutSec = 60;
    let timeRemainingSeconds = 0;
    let timeRemainingInterval = null;

    let isConnected = false;

    if (!validToken) {
        window.app.pushRoute('/');
        return;
    }
    
    if (role === 'admin') {
        window.app.pushRoute('/admin/dashboard');
        return;
    }

    const socketClient = new SocketClient();
    socketClient.connect();
    socketClient.on('connect', () => {
        console.log('[SOCKET] connected, waiting for commands.');
    });

    socketClient.on('TIME_REMAINING', (data) => {
        timeRemainingSeconds = data.timeRemaining;
        renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, data.timeRemaining);
    })

    // Time containers
    const hoursSpan = document.getElementById('earn-hours-span');
    const minSpan = document.getElementById('earn-min-span');
    const secSpan = document.getElementById('earn-sec-span');
    const TRhoursSpan = document.getElementById('hours-span');
    const TRminSpan = document.getElementById('min-span');
    const TRsecSpan = document.getElementById('sec-span');


    // Modals
    const modal = document.getElementById('modal');
    const droppingModal = document.getElementById('dropping-modal');

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

    let isInternetUp = false;
    socketClient.emit('CHECK_INTERNET');
    socketClient.on('INTERNET_STATUS', (data) => {
        isInternetUp = data.online;
    });

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

    const connectBtn = document.getElementById('connect');
    connectBtn.addEventListener('click', async function() {
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
        console.log("DROP BTN TRIGGER");
    
        socketClient.once('DROP:busy', () => {
            droppingModal.style.display = 'block';
        });

        socketClient.once('DROP:allowed', () => {
            modal.style.display = 'block';
            startDropTimeout();
            // updateEarnedTimeDisplay();
            socketClient.on('TIME_EARNED', (data) => {
                renderEarnTime({ hoursSpan, minSpan, secSpan }, data.timeEarned);
            })
            startDropListeners();
        });

        socketClient.emit('DROPPING');
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
        socketClient.emit('ADD_TIME');
        updateTimeRemaining();
        window.app.pushRoute("/portal");
    });


    console.log("Time Remaining Seconds", timeRemainingSeconds);
    console.log('Internet', isInternetUp)
    updateConnectButtonState()

}