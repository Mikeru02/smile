import axios from 'axios';

export default function startTimeDeductor() {
    // console.log(`[DISABLED] Time deductor disabled - using socket-based time deduction`);
    
    // // Worker disabled - time deduction now handled by socket server
    // // Keeping this file for reference but it's no longer needed
    
    // // Old implementation (disabled):
    // // setInterval(async () => { ... }, 10000);

    setIntervar(async () => {
        try {
            const not = Date.now();
            const activeClients = await getActiveClients();
            for (const client of activeClients) {
                
            }
        } catch (err) {
            console.error("Worker error: ", err);
        }
    }, 5000)
}