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
            console.error('[ERROR] ClientsSocketEvents.GET_CLIENTS', err.message);
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
            console.error('[ERROR] ClientsSocketEvents.DELETE_CLIENT', err.message);
        }
    })

    socket.on('GET_SPECIFIC_CLIENT', async (data) => {
        try {
            const clientData = await server.axiosClient.get(
                `client/?field=id&value=${data.clientid}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": import.meta.env.VITE_SRC_KEY,
                        "token": localStorage.getItem('token')
                    }
                }
            )

            socket.emit('SPECIFIC_CLIENT', ({ clientData: clientData.data.data }))
        }
        catch (err) {
            console.error('[ERROR] ClientsSocketEvents.GET_SPECIFIC_CLIENT', err.message);
        }
    })
}