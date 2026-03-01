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
    let timeEarnedSeconds = 0;
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

    let isInternetUp;
    socketClient.on('INTERNET_STATUS', (data) => {
        console.log("DEBUG: ", data);
        isInternetUp = data.online;

        if (!isInternetUp){
            document.getElementById('internet-anouncement').style.display = 'flex';
        }
        updateConnectButtonState();
    });

    socketClient.on('TIME_REMAINING', (data) => {
        timeRemainingSeconds = data.timeRemaining;
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
                // await axios.patch(
                //     `${baseUrl}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/revoke`,
                //     {},
                //     {
                //         headers: {
                //             'Content-Type': 'application/json',
                //             'apikey': import.meta.env.VITE_SRC_KEY,
                //             'token': localStorage.getItem('token')
                //         }
                //     }
                // );
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
            // socketClient.on('TIME_REMAINING', (data) => {
            //     renderEarnTime({ hoursSpan, minSpan, secSpan }, data.timeEarned);
            // })

            const redirectToSurvey = Math.random() < 0.5;
            if (redirectToSurvey) {
                window.location.href = 'https://forms.gle/LEGksfLDYJH5Ws9r7';
                return;
            }
        } else {
            connect.textContent = 'Connect';
            clearInterval(timeRemainingInterval);
            isConnected = false;
            timeRemainingInterval = null;
            socketClient.emit('DEAUTH_CLIENT')
            // updateTimeRemaining();
            // socketClient.on('TIME_REMAINING', (data) => {
            //     renderEarnTime({ hoursSpan, minSpan, secSpan }, data.timeEarned);
            // })
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
            socketClient.on('TIME_EARNED', (data) => {
                timeEarnedSeconds = data.timeEarned;
                renderEarnTime({ hoursSpan, minSpan, secSpan }, data.timeEarned);
                updateProceedButtonState();
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
    });

    const proceedBtn = document.getElementById('proceed');
    proceedBtn.addEventListener('click', async function() {
        socketClient.emit('DROP_COMPLETE');
        stopDropListeners();
        modal.style.display = 'none';
        clearInterval(earnInterval);
        socketClient.emit('ADD_TIME');
        window.app.pushRoute("/portal");
    });
}