export default function ClientsSocketEvents(socket, server) {
    socket.on('GET_CLIENTS', async () => {
        try {
            const clients = await server.axiosClient.get(
                `client/all`,
                {
                    headers: {
                        "token": socket.token
                    }
                }
            )

            socket.emit('CLIENTS', ({ clients: clients.data.data }));
        }
        catch (err) {
            console.error('ERROR', err.message);
        }
    })

    socket.on('DELETE_CLIENT', async (data) => {
        try {
            await server.axiosClient.delete(
                `client/?field=id&value=${data.clientId}`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )

            const clients = await server.axiosClient.get(
                `client/all`,
                {
                    headers: {
                        "token": socket.token
                    }
                }
            )

            socket.emit('CLIENTS', ({ clients: clients.data.data }));
        }
        catch (err) {
            console.error('ERROR',err.message);
        }
    })
}