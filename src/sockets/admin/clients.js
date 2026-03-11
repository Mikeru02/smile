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

            // Separate status from other fields
            const { status, ...otherFields } = data.clientData;

            let statusUpdated = false;

            // Handle auth/deauth only if IP exists
            if (specificClient?.ip) {
                if (status === 'active') {
                    await server.axiosClient.patch(
                        `client/auth`,
                        { clientId: specificClient.id },
                        { headers: { token: socket.token } }
                    );
                    statusUpdated = true;
                } else if (status === 'paused' || status === 'pending') {
                    await server.axiosClient.patch(
                        `client/deauth`,
                        { clientId: specificClient.id },
                        { headers: { token: socket.token } }
                    );
                    statusUpdated = true;
                } else {
                    console.log(`[UPDATE_CLIENT] Status '${status}' skipped. No auth/deauth performed.`);
                }
            } else {
                console.log(`[UPDATE_CLIENT] No IP for client ${specificClient?.id}. Skipping auth/deauth.`);
            }

            // Update DB
            // - If statusUpdated → include status in the DB update
            // - If not → only update other fields (without overwriting status)
            const dbPayload = statusUpdated
                ? data.clientData
                : otherFields; // omit status if we didn’t authenticate/deauthenticate

            await server.axiosClient.patch(
                `client/?field=id&value=${data.clientId}`,
                dbPayload,
                { headers: { token: socket.token } }
            );

            // Fetch and emit updated client list
            const clients = await server.axiosClient.get(
                `client/all`,
                { headers: { token: socket.token } }
            );

            socket.emit('CLIENTS', { clients: clients.data.data });

        } catch (err) {
            console.error('[ERROR] ClientsSocketEvents.UPDATE_CLIENT', err.response?.data || err.message);
        }
    });
}