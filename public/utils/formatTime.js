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

export function formatDate(date) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return date; // Return original if invalid date
    
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    };
    
    return dateObj.toLocaleDateString('en-US', options);
}

export function formatDateTime(date) {
    if (!date) return '';

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return date; // Return original if invalid date

    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-hour format
    };

    return dateObj.toLocaleString('en-US', options).replace(',', '');
}