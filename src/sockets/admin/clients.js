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
                `client/?field=id&value=${data.clientId}`,
                {
                    headers: {
                        "token": socket.token
                    }
                }
            )

            socket.emit('SPECIFIC_CLIENT', ({ clientData: clientData.data.data[0] }))
        }
        catch (err) {
            console.error('[ERROR] ClientsSocketEvents.GET_SPECIFIC_CLIENT', err.message);
        }
    })

    socket.on('UPDATE_CLIENT', async (data) => {
        try {
            const clientResponse = await server.axiosClient.get(
                `client/?field=id&value=${data.clientId}`,
                { headers: { token: socket.token } }
            );

            const specificClient = clientResponse.data.data[0];
            let shouldUpdateDB = false;

            if ('status' in data.clientData) {
                // Status exists → handle active/paused/pending
                if (data.clientData.status === 'active' && specificClient?.ip) {
                    await server.axiosClient.patch(
                        `client/auth`,
                        { clientId: specificClient.id },
                        { headers: { token: socket.token } }
                    );
                    shouldUpdateDB = true;
                } else if (
                    (data.clientData.status === 'paused' || data.clientData.status === 'pending') 
                    && specificClient?.ip
                ) {
                    await server.axiosClient.patch(
                        `client/deauth`,
                        { clientId: specificClient.id },
                        { headers: { token: socket.token } }
                    );
                    shouldUpdateDB = true;
                } else {
                    console.log(`[UPDATE_CLIENT] Status '${data.clientData.status}' skipped. No auth/deauth performed.`);
                }
            } else {
                // Status not included → always update DB
                shouldUpdateDB = true;
            }

            // Update DB only if flagged
            if (shouldUpdateDB) {
                await server.axiosClient.patch(
                    `client/?field=id&value=${data.clientId}`,
                    data.clientData,
                    { headers: { token: socket.token } }
                );
            }

            // Fetch and emit updated client list
            const clients = await server.axiosClient.get(
                `client/all`,
                { headers: { token: socket.token } }
            );

            socket.emit('CLIENTS', { clients: clients.data.data });

        } catch (err) {
            console.error('[ERROR] ClientsSocketEvents.UPDATE_CLIENT', err.message);
        }
    });
}