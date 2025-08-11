import { Server } from 'socket.io';
import http from 'http';

function init(httpServer: http.Server) {
    const io: Server = new Server(httpServer, {});
    console.log("Socket.IO initialized.");

    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        socket.on('join_user_room', (userId: number) => {
            console.log(`Client ${socket.id} joined room for user ${userId}`);
            socket.join(`user_room_${userId}`);
        });

        socket.on('disconnect', () => {
            console.log(`✖️ Client disconnected: ${socket.id}`);
        });
        // productHandler(io, socket);
        // orderHandler(io, socket);
    });
    return io;
}

const socket = {
    init
};
export default socket;