import axios from 'axios';

export default function startTimeDeductor() {
    console.log(`[DISABLED] Time deductor disabled - using socket-based time deduction`);
    
    // Worker disabled - time deduction now handled by socket server
    // Keeping this file for reference but it's no longer needed
    
    // Old implementation (disabled):
    // setInterval(async () => { ... }, 10000);
}