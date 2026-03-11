import BackupWorker from "../../workers/backupWorker.js";

export default function SettingsSocketEvents(socket, server) {
    socket.on("GET_SETTINGS", async () => {
        socket.emit('SET_UTILITY_MODE', { mode: server.utilityMode});

        const prohibited = await server.axiosClient.get(
            `link/prohibited/all`,
            {
                headers: {
                    "token": socket.token
                }
            }
        )
        const setting = await server.axiosClient.get(
            `setting/`,
            {
                headers: {
                    'token': socket.token
                }
            }
        )

        socket.emit("PROHIBITED", ({ links: prohibited.data.data }))
        socket.emit('SETTINGS', ({ settings: setting.data.data[0] }))
    })

    socket.on("SET_PROHIBITED", async (data) => {
        try {
            const existingDomain = await server.axiosClient.get(
                `link/prohibited?domain=${data.domain}`,
                {
                    headers: {
                        "token": socket.token
                    }
                }
            )

            if (existingDomain && existingDomain.length > 0) {
                socket.emit('PROHIBITED_ERROR', ({ message: "Domain already in the list!" }))
                return;
            }

            const createResponse =  await server.axiosClient.post(
                `link/prohibited`,
                { domain: data.domain},
                {
                    headers: {
                        "token": socket.token
                    }
                }
            )

            const prohibited = await server.axiosClient.get(
                `link/prohibited/all`,
                {
                    headers: {
                        "token": socket.token
                    }
                }
            )

            const links = prohibited.data.data;
            socket.emit('PROHIBITED', ({ links: links }))
        }
        catch (err){
            console.error("ERROR", err);
        }
    })

    socket.on("REMOVE_PROHIBITED", async (data) => {
        try {
            await server.axiosClient.delete(
                `link/prohibited/${data.id}`,
                {
                    headers: {
                        "token": socket.token
                    }
                }
            )

            const prohibited = await server.axiosClient.get(
                `link/prohibited/all`,
                {
                    headers: {
                        "token": socket.token
                    }
                }
            )

            const links = prohibited.data.data;
            socket.emit('PROHIBITED', ({ links: links }))

        }
        catch (err){
            console.error("ERROR", err);
        }
    });

    socket.on('SAVE', async (data) => {
        try {
            await server.axiosClient.patch(
                `setting/`,
                data,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )

            const setting = await server.axiosClient.get(
                `setting/`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )

            socket.emit('SETTINGS', ({ settings: setting.data.data[0] }))
        }
        catch (err) {
            console.error('ERROR', err.message)
        }
    })

    socket.on('RESTORE', async () => {
        try {
            await server.axiosClient.patch(
                `setting/restore`,
                {},
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )

            const setting = await server.axiosClient.get(
                `setting/`,
                {
                    headers: {
                        'token': socket.token
                    }
                }
            )

            socket.emit('SETTINGS', ({ settings: setting.data.data[0] }))
        }
        catch (err) {
            console.error('ERROR',err.message);
        }
    });

    socket.on("BACKUP_NOW", (data) => {
        const backupWorker = new BackupWorker();
        backupWorker.backupNow();
    })

    socket.on('UTILITY_MODE', (data) => {
        const mode = data.mode;
        server.utilityMode = mode;
        server.arduino.sendCommand(`SET_UTILITY_MODE:${mode}`);
        socket.emit('SET_UTILITY_MODE', { mode: server.utilityMode })
    })
}