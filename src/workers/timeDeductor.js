import axios from 'axios';

export default function startTimeDeductor() {
    console.log(`[RUNNING] Time deductor started (30s Interval)`);

    setInterval(async () => {
        const response = await axios.patch(
            `http://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_ROUTE_VERSION}/client/all`, 
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.API_KEY``
                }
            }
        )
    }, 30000);
}