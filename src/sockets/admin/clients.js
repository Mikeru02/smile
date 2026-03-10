export default function ClientsSocketEvents(socket, axiosClient) {
    socket.on('GET_CLIENTS', async () => {
        try {
            const clients = await this.axiosClient.get(
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
            await this.axiosClient.delete(
                `client/?field=id&value=${data.clientId}`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )

            const clients = await this.axiosClient.get(
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