import secondsToTime from "./secondsToTime.js";

export function formatSeconds(seconds) {
    if (typeof seconds !== 'number' || seconds < 0) return '00:00:00';

    const { hrs, mins, secs } = secondsToTime(seconds);

    return [
        String(hrs).padStart(2, "0"),
        String(mins).padStart(2, "0"),
        String(secs).padStart(2, "0")
    ].join(":");
}