import axios from 'axios';
import { renderEarnTime, renderTimeRemaining } from '../../../utils/render.js';
import  BGIMG from '/icons/bgimg.svg';

export default async function Events() {
    document.body.style.backgroundImage = `url('${BGIMG}')`;

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
        await axios.post(
            `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/test/add`, 
            { "earned_time": timeEarned }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': import.meta.env.VITE_SRC_KEY,
                    'token': localStorage.getItem('token')
            }
            }
        );
        updateEarnedTimeDisplay();

        // await axios.post(
        //     `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/start`, 
        //     { "earned_time": timeEarned }, 
        //     {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'apikey': import.meta.env.VITE_SRC_KEY,
        //             'token': localStorage.getItem('token')
        //     }
        //     }
        // );
        // earn();
        // earnInterval = setInterval(earn, 1000);
    });

    const exit = document.getElementById('exit');
    exit.addEventListener('click', async function() {
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
        renderEarnTime({ hoursSpan, minSpan, secSpan }, earnedSeconds);
    }

    const earn = async () => {
        if (isRunning) return;

        isRunning = true;

        await axios.post(`http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}/api/${import.meta.env.VITE_SRC_ROUTE_VERSION}/client/earn`, 
            { earned_time: timeEarned },
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
        }, 1000);
    }

    updateTimeRemaining()


}