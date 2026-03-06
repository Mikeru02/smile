import { io } from 'socket.io-client';

class SocketClient {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (this.socket) return;

        const token = localStorage.getItem('token');
        
        this.socket = io(
            `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`,
            {
                autoConnect: true,
                transports: ['websocket', 'polling'],
                auth: { token }
            }
        );

        this.socket.on('connect', () => {
            console.log('[SOCKET] connected: ', this.socket.id);
        });

        this.socket.on('disconnect', () => {
            console.log('[SOCKET] disconnected', this.socket.id);
        })
    }

    on(event, handler) {
        if (!this.socket) return;
        this.socket.on(event, handler);
    }

    once(event, handler) {
        if (!this.socket) return;
        this.socket.once(event, handler);
    }
    
    emit(event, payload) {
        if (!this.socket || !this.socket.connected) return;
        this.socket.emit(event, payload);
    }

    off(event, handler) {
        if (!this.socket) return;
        this.socket.off(event, handler);
    }

    disconnect() {
        if (!this.socket) return;

        this.socket.disconnect();
        this.socket = null;
    }
}

export default SocketClient;