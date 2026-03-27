export default function AccountsSocketEvents(socket, server) {
    socket.on("GET_ACCOUNTS", async () => {
        try {
            const account = await server.axiosClient.get(
                `account/all`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )
            socket.emit("ACCOUNTS", ({ accounts: account.data.data }))
        }
        catch (err) {
            console.error('[ERROR] AccountsSocketEvents.GET_ACCOUNTS', err.message);
        }
    })

    socket.on('UPDATE_ACCOUNT', async (data) => {
        try {
            await server.axiosClient.patch(
                `account/?field=id&value=${data.accountId}`,
                data.accountData,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )
            const account = await server.axiosClient.get(
                `account/all`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )
            socket.emit("ACCOUNTS", ({ accounts: account.data.data }))
        }
        catch (err) {
            console.error('[ERROR] AccountsSocketEvents.UPDATE_ACCOUNT', err.message);
        }
    })

    socket.on('DELETE_ACCOUNT', async (data) => {
        try {
            await server.axiosClient.delete(
                `account/?field=id&value=${data.accountId}`,
                {
                    headers: {
                        "token": socket.token
                    }
                }
            )
            const account = await server.axiosClient.get(
                `account/all`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )
            socket.emit("ACCOUNTS", ({ accounts: account.data.data }))
        }
        catch (err) {
            console.error('[ERROR] AccountsSocketEvents.DELETE_ACCOUNT', err.message);
        }
    })

    socket.on('CREATE_ACCOUNT', async (data) => {
        try {
            await server.axiosClient.post(
                `account/`,
                data,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )
            const account = await server.axiosClient.get(
                `account/all`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )
            socket.emit("ACCOUNTS", ({ accounts: account.data.data }))
        }
        catch (err) {
            console.error('[ERROR] AccountsSocketEvents.CREATE_ACCOUNT', err.message);
        }
    })

    socket.on('GET_SPECIFIC_ACCOUNT', async (data) => {
        try {
            const accountData = await server.axiosClient.get(
                `account/?field=id&value=${data.accountId}`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )
            socket.emit('SPECIFIC_ACCOUNT', { accountData: accountData.data.data });
        }
        catch (err) {
            console.error('[ERROR] AccountsSocketEvents.GET_SPECIFIC_ACCOUNT', err.message);
        }
    })

    socket.on("FILTER_ACCOUNT", async (data) => {
        try {
            const response = await server.axiosClient.get(
                `account/export`,
                {
                    headers: {
                        "token": socket.token
                    },
                    params: {
                        role: data.role,
                        from: data.from,
                        to: data.to,
                        limit: data.limit
                    }
                }
            )
            const accounts = response.data.data || [];
            socket.emit('ACCOUNTS', ({ accounts: accounts }));
        }
        catch (err) {
            console.error('[ERROR] AccountsSocketEvents.FILTER_ACCOUNT', err.message);
        }
    })
}