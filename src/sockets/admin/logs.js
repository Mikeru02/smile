export default function LogsSocketEvents(socket, server) {
    socket.on('GET_LOGS', async () => {
        try {
            const response = await server.axiosClient.get(
                `logs/?limit=100`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )

            socket.emit('LOGS', ({ logs: response.data.data }));
        }
        catch (err) {
            console.error('[ERROR] LogsSocketEvents.GET_LOGS', err.message);
        }
    })

    socket.on('FILTER_LOGS', async (data) => {
        try {
            const response = await server.axiosClient.get('logs/export', {
                headers: {
                    "token": socket.token
                },
                params: {
                    level: data.level,
                    from: data.from,
                    to: data.to,
                    limit: data.limit
                }
            });

            const logs = response.data.logs || [];

            console.log("LOGS: ", logs);
            socket.emit('LOGS', ({ logs: logs }));
        }
        catch (err) {
            console.error('[ERROR] LogsSocketEvents.FILTER_LOGS', err.message);
        }
    })
}