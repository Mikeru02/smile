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
            const response = await axiosClient.get('client/export', {
                headers: {
                    "token": localStorage.getItem('token')
                },
                params: {
                    is_logged: data.isLogedIn,
                    status: data.status,
                    from: data.from,
                    to: data.to,
                    limit: data.limit
                }
            });

            const logs = response.data.logs || [];
            socket.emit('LOGS', ({ logs: logs }));
        }
        catch (err) {
            console.error('[ERROR] LogsSocketEvents.GET_LOGS', err.message);
        }
    })
}