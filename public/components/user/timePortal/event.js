import SocketClient from '../../../sockets/socketClient.js';
import { renderEarnTime, renderTimeRemaining } from '../../../utils/render.js';
import checkToken from '../../../utils/checkToken.js';
import { getRole } from '../../../utils/getRole.js';
import ILLUSTRATION2 from '/icons/warning.svg';
import styles from './component.module.css';

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
    let timeEarnedSeconds = 0;
    let timeRemainingInterval = null;
    let isInternetUp;

    let isConnected = false;

    if (!validToken) {
        window.app.pushRoute('/');
        return;
    }
    
    if (role === 'admin') {
        window.app.pushRoute('/admin/dashboard');
        return;
    }

    // Socket Events            ************************************************************
    const socketClient = new SocketClient();
    socketClient.connect();
    socketClient.on('connect', () => {
        console.log('[SOCKET] connected, waiting for commands.');
        socketClient.emit('GET_BIN_STATUS');
    });

    socketClient.once('DROP:allowed', () => {
        modal.style.display = 'block';
        startDropTimeout();
    });

    socketClient.on('TIME_EARNED', (data) => {
        timeEarnedSeconds = data.timeEarned;
        renderEarnTime({ hoursSpan, minSpan, secSpan }, data.timeEarned);
        updateProceedButtonState();
    })

    socketClient.on('DROP:busy', () => {
        droppingModal.style.display = 'block';
    });

    socketClient.on('DROP_FINISHED', () => {
        modal.style.display = 'none';
        clearInterval(earnInterval);
        updateTimeRemaining();
    })

    socketClient.on('ARDUINO:SONAR', () => {

    });

    socketClient.on('TIME_REMAINING', (data) => {
        timeRemainingSeconds = data.timeRemaining;
        console.log("DEbUG", timeRemainingSeconds)
        updateConnectButtonState();
        renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, data.timeRemaining);
    });

    socketClient.on('CLIENT_STATUS', (data) => {
        if (data.status === 'active') {
            connect.textContent = 'Pause';
            isConnected = true;
            startTime();
        }
    });

    socketClient.on('UTILITY_MODE', (data) => {
        console.log(data);
        updateDropButtonState(data);
        if (data.mode === "on") {
            annoucementContainer.innerHTML = `
                <img src="${ILLUSTRATION2}" class="${styles['illustration2']}">
                <p>Utility staff is currently using the bin. Please wait</p>
            `;
            annoucementContainer.style.display = 'flex';
        }
        else {
            annoucementContainer.style.display = 'none';
            annoucementContainer.innerHTML = '';
        }
    })

    socketClient.on('BIN_STATUS', (data) => {
        updateDropButtonState(data);
        console.log('[SOCKET] Bin status: ', data.status);
        if (data.status !== 'all_ok') {
            annoucementContainer.innerHTML = `
                <img src="${ILLUSTRATION2}" class="${styles['illustration2']}">
                <p>${data.status.replace('_', ' ')} is full. Waiting for removal.</p>
            `;
            annoucementContainer.style.display = 'flex';
        } else {
            annoucementContainer.style.display = 'none';
            annoucementContainer.innerHTML = '';
        }
    });

    socketClient.on('INTERNET_STATUS', (data) => {
        console.log("DEBUG: ", data);
        isInternetUp = data.online;

        if (!isInternetUp){
            annoucementContainer.innerHTML = '';
            annoucementContainer.innerHTML = `
                <img src="${ILLUSTRATION2}" class="${styles['illustration2']}">
                <p>No Internet. Please wait</p>
            `
            annoucementContainer.style.display = 'flex';
        }
        updateConnectButtonState();
    });



    // Time containers
    const hoursSpan = document.getElementById('earn-hours-span');
    const minSpan = document.getElementById('earn-min-span');
    const secSpan = document.getElementById('earn-sec-span');
    const TRhoursSpan = document.getElementById('hours-span');
    const TRminSpan = document.getElementById('min-span');
    const TRsecSpan = document.getElementById('sec-span');

    const annoucementContainer = document.getElementById('announcement-container')

    // Modals
    const modal = document.getElementById('modal');
    const droppingModal = document.getElementById('dropping-modal');

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

    const updateTimeRemaining = () => {
        renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, timeRemainingSeconds);
    }

    const updateDropButtonState = (data) => {
        const status = data.status; // can me undefined
        const mode = data.mode; // can be undefined

        if (status) {
            if (status !== 'all_ok') {
                dropBtn.disabled = true;
                dropBtn.style.opacity = '0.5';
                dropBtn.style.cursor = 'not-allowed';
            }
            else {
                console.log("Changing state of drop button")
                dropBtn.disabled = false;
                dropBtn.style.opacity = '1';
                dropBtn.style.cursor = 'pointer';
            }
        }

        if (mode) {
            if (mode === "on"){
                dropBtn.disabled = true;
                dropBtn.style.opacity = '0.5';
                dropBtn.style.cursor = 'not-allowed';
            }
            else {
                console.log("Changing state of drop button")
                dropBtn.disabled = false;
                dropBtn.style.opacity = '1';
                dropBtn.style.cursor = 'pointer';
            }
        }
    }

    const updateProceedButtonState = () => {
        const isEarnedTimeZero = timeEarnedSeconds <= 0;

        if (isEarnedTimeZero) {
            proceedBtn.disabled = true;
            proceedBtn.style.opacity = '0.5';
            proceedBtn.style.cursor = 'not-allowed';
        } else {
            proceedBtn.disabled = false;
            proceedBtn.style.opacity = '1';
            proceedBtn.style.cursor = 'pointer';
        }
    }

    const updateConnectButtonState = () => {
        const isTimeZero = timeRemainingSeconds <= 0;

        if (isTimeZero || !isInternetUp) {
            connectBtn.disabled = true;
            connectBtn.style.opacity = '0.5';
            connectBtn.style.cursor = 'not-allowed';
        } else {
            connectBtn.disabled = false;
            connectBtn.style.opacity = '1';
            connectBtn.style.cursor = 'pointer';
        }
    };

    const startTime = () => {
        if (timeRemainingInterval) return;
        timeRemainingInterval = setInterval(async () => {
            if (!isConnected) return;

            if (timeRemainingSeconds <= 0) {
                clearInterval(timeRemainingInterval);
                timeRemainingInterval = null;
                socketClient.emit('DEAUTH_CLIENT');
                connect.textContent = 'Connect';
                isConnected = false;
                return;
            }

            timeRemainingSeconds -= 1;
            socketClient.emit('DEDUCT_TIME', {timeRemaining: timeRemainingSeconds });
            renderTimeRemaining({ TRhoursSpan, TRminSpan, TRsecSpan }, timeRemainingSeconds);
            updateConnectButtonState();
        }, 1000);
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
        }
    });


    const dropBtn = document.getElementById('start-drop');
    dropBtn.addEventListener('click', async function() {
        console.log("DROP BTN TRIGGER");
        socketClient.emit('DROPPING');
    });

    const okBtn = document.getElementById('ok-button');
    okBtn.addEventListener('click', function() {
        droppingModal.style.display = 'none';
    })

    const exit = document.getElementById('exit');
    exit.addEventListener('click', async function() {
        socketClient.emit('DROP_COMPLETE');
        modal.style.display = 'none';
        clearInterval(earnInterval);
    });

    const proceedBtn = document.getElementById('proceed');
    proceedBtn.addEventListener('click', async function() {
        socketClient.emit('DROP_COMPLETE');
        modal.style.display = 'none';
        clearInterval(earnInterval);
        socketClient.emit('ADD_TIME');
        window.app.pushRoute("/portal");
    });
}