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
        socket.emit('ARDUINO:IR', "HELLO")
        
        // On
        socket.on('DROPPING', () => {
            console.log('Client drop a trash');
            arduino.sendCommand('DROPPING');
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected: ', socket.id);
        })
    });

    return io;
}