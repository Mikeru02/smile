import { Server } from 'socket.io';

let io = null;

let activeClient = null;    

export function initSocket(server, arduino) {
    if (io) return io;

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected: ', socket.id);
        
        // On
        socket.on('DROPPING', () => {
            if (activeClient) {
                socket.emit("DROP:busy", { message: "Another user is dropping" });
                return;
            }
            console.log('Client started DROP: ', socket.id);

            activeClient = socket;

            if (arduino) {
                arduino.sendCommand("DROPPING");
            }
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected: ', socket.id);
            if (activeClient === socket) {
                activeClient = null;
            }
        })
    });

    if (arduino) {
        arduino.parser.on("data", (data) => {
            data = data.trim();
            if (data === "SONAR DETECTED") {
                console.log('IR Detected from Arduino');

                if (activeClient) {
                    activeClient.emit("ARDUINO:SONAR", {
                        detected: true,
                        time: Date.now(),
                    });
                    //activeClient = null;
                }
            }
        })
    }

    return io;
}