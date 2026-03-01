import axios from 'axios';
import ClientManagement from '../utils/clientManagement.js';

export default function startTimeDeductor() {
    const loopInterval = 30;
    const deductLoop = async () => {
        try {
            console.log('Time Deductor Worker starts')
            const activeClientsResponse = await axios.get(
                `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/client/status/active`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': process.env.SRC_KEY
                    }
                }
            )
            const activeClients = activeClientsResponse.data.data;
            
            for (const client of activeClients) {
                console.log("DEBUG: ", client);
                let newTimeRemaining = client.time_remaining - loopInterval;
                if (newTimeRemaining < 0) newTimeRemaining = 0;

                const connectionStart = new Date(client.connection_start_at).getTime();
                const newExpireAt = new Date(connectionStart + newTimeRemaining * 1000);
                const formattedExpireAt = newExpireAt.toLocaleString('sv-SE').replace('T', ' ')
                const newStatus = newTimeRemaining <= 0 ? 'pending' : 'active';

                if (newStatus === 'pending') {
                    ClientManagement.revokeClient(client.ip);
                }

                await axios.patch(
                    `http://${process.env.SRC_HOST}:${process.env.SRC_PORT}/api/v1/client/id/${client.id}`,
                    {
                        name: client.name,
                        course: client.course,
                        year_level: client.yearlevel,
                        status: newStatus,
                        time_remaining: newTimeRemaining,
                        time_earned: client.time_earned,
                        expire_at: formattedExpireAt
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': process.env.SRC_KEY,
                        }
                    }
                )
            }
        } catch (err) {
            console.error('Time Deductor Error: ', err);
        } finally {
            setTimeout(deductLoop, loopInterval * 1000);
        }
    }

    setTimeout(deductLoop, loopInterval * 1000);
}