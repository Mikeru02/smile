import { Server } from 'socket.io';

let io = null;

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

        // Emit
        
        // On
        socket.on('DROP', () => {
            console.log('Client drop a trash');
            arduino.sendCommand('DROP');
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected: ', socket.id);
        })
    })
}