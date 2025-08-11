import { Server } from 'socket.io';
import http from 'http';

let ioInstance: Server | null = null;

function init(httpServer: http.Server) {
    const io = new Server(httpServer, {});
    ioInstance = io;
    console.log("Socket.IO initialized.");

    io.on('connection', (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);

        socket.on('event', data => {
            console.log('print data: ', data);
            socket.emit("basicEmit", 1, "2", Buffer.from([3]));
        });

        socket.onAny((data) => {
            console.log("on any data", data);
            io.emit("sendmsg", 123);
        })

        socket.on('disconnect', () => {
            console.log(`✖️ Client disconnected: ${socket.id}`);
        });
    });
    return io;
}

function get() {
    return ioInstance;
}

const socket = {
    init,
    get
};
export default socket;