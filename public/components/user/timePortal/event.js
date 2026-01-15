import axios from 'axios';
import  BGIMG from '/icons/bgimg.svg';

export default async function Events() {
    document.body.style.backgroundImage = `url('${BGIMG}')`;

    const hoursSpan = document.getElementById('earn-hours-span');
    const minSpan = document.getElementById('earn-min-span');
    const secSpan = document.getElementById('earn-sec-span');

    const TRhoursSpan = document.getElementById('hours-span');
    const TRminSpan = document.getElementById('min-span');
    const TRsecSpan = document.getElementById('sec-span');

    let earnInterval = null;
    let isRunning = false;
    const timeEarned = 10;

    const modal = document.getElementById('modal');
    const dropBtn = document.getElementById('start-drop');
    dropBtn.addEventListener('click', async function() {
        modal.style.display = 'block';
        await axios.post(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_ROUTE_VERSION}/client/start`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_API_KEY,
                'token': localStorage.getItem('token')
            }
        })
        earn();
        earnInterval = setInterval(earn, 1000);
    });

    const exit = document.getElementById('exit');
    exit.addEventListener('click', async function() {
        modal.style.display = 'none';
        clearInterval(earnInterval);
        const response = await axios.patch(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_ROUTE_VERSION}/client/`, {
            status: 'pending'
        }, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_API_KEY,
                'token': localStorage.getItem('token')
            }
        });
        console.log("DEBUG: ", response.data)
    });

    const proceed = document.getElementById('proceed');
    proceed.addEventListener('click', async function() {
        modal.style.display = 'none';
        clearInterval(earnInterval);
        const response = await axios.post(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_ROUTE_VERSION}/client/authenticate`, {}, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_API_KEY,
                'token': localStorage.getItem('token')
            }
        });
        console.log("DEBUG: ", response.data)
        updateTimeRemaining()
    })

    const connect = document.getElementById('connect');
    let isConnected = false;
    connect.addEventListener('click', async function() {
        if (!isConnected) {
            connect.textContent = 'Pause';
            isConnected = true;
        } else {
            connect.textContent = 'Connect';
            isConnected = false;
        }
    })

    const updateTimeRemaining = async () => {
        const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_ROUTE_VERSION}/client/time_remaining`, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_API_KEY,
                'token': localStorage.getItem('token')
            }
        });

        const earnedSeconds = response.data.data.time_remaining;
        const { hrs, mins, secs} = secondsToTime(earnedSeconds);
        TRhoursSpan.textContent = String(hrs).padStart(2, '0');
        TRminSpan.textContent = String(mins).padStart(2, '0');
        TRsecSpan.textContent = String(secs).padStart(2, '0');
    }

    const updateEarnedTimeDisplay = async () => {
        const response = await axios.get(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_ROUTE_VERSION}/client/time_earned`, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_API_KEY,
                'token': localStorage.getItem('token')
            }
        });

        if (!response.data.success) return;

        const earnedSeconds = response.data.data.time_earned;
        const { hrs, mins, secs} = secondsToTime(earnedSeconds);

        hoursSpan.textContent = String(hrs).padStart(2, '0');
        minSpan.textContent = String(mins).padStart(2, '0');
        secSpan.textContent = String(secs).padStart(2, '0');
    }

    const earn = async () => {
        if (isRunning) return;

        isRunning = true;

        const response = await axios.post(`http://${import.meta.env.VITE_API_HOST}:${import.meta.env.VITE_API_PORT}/${import.meta.env.VITE_API_ROUTE_VERSION}/client/earn`, {
            earned_time: timeEarned
        }, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': import.meta.env.VITE_API_KEY,
                'token': localStorage.getItem('token')
            }
        });

        updateEarnedTimeDisplay();
        isRunning = false;
    }

    const secondsToTime = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        return {
            hrs,
            mins,
            secs
        };
    };

    updateTimeRemaining()


}