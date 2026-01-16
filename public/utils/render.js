import secondsToTime from './secondsToTime.js';

export function renderTimeRemaining(containers, time) {
    const { TRhoursSpan, TRminSpan, TRsecSpan } = containers;
    const { hrs, mins, secs } = secondsToTime(time);

    TRhoursSpan.textContent = String(hrs).padStart(2, '0');
    TRminSpan.textContent = String(mins).padStart(2, '0');
    TRsecSpan.textContent = String(secs).padStart(2, '0');
}

export function renderEarnTime(containers, time) {
    const { hoursSpan, minSpan, secSpan } = containers;
    const { hrs, mins, secs } = secondsToTime(time);

    hoursSpan.textContent = String(hrs).padStart(2, '0');
    minSpan.textContent = String(mins).padStart(2, '0');
    secSpan.textContent = String(secs).padStart(2, '0');
}