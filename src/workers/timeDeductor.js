import axios from 'axios';

export default function startTimeDeductor() {
    console.log(`[RUNNING] Time deductor started (30s Interval)`);

    setInterval(async () => {
        await axios.patch(
            `http://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_ROUTE_VERSION}/client/all`, 
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.API_KEY
                }
            }
        )

        const response = await axios.get(
            `http://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_ROUTE_VERSION}/client/outOfTime`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': process.env.API_KEY
                }
            }
        )

        console.log(response.data.data);


    }, 5000);
}