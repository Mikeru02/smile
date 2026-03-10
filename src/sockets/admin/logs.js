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
}