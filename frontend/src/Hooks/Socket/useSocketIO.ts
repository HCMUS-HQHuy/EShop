import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./socketEvents.ts";
import type { Socket } from "socket.io-client";

// step 1 -> initialsocket 

// const {socket} = useSocket()

// socket => object data

// if(!socket) return

// function handleGetData(data) => {
//     if(check condition)
// }

// socket.on("event", function)

// socket.off("event", function)

// step 2 -> check status connect socket

// step 3 -> return 1 global hook socket

const useSocketIO = (url: string) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [val, setVal] = useState<any>(null);
    
    const socketRef = useRef<Socket | null>(null);
    useEffect(() => {
        function connectHandle() {
            setIsOpen(true);
        }
        function disconnectHandle() {
            setIsOpen(false);
        }
        function setStatusHandle(data: MessageEvent) {
            console.log("Message received:", data);
            setVal(data);
        }
        function errorHandle(error: Error) {
            console.error("Socket connection error:", error);
        }

        const socket: Socket = io(url, { withCredentials: true });
        socket.on(SOCKET_EVENTS.CONNECTION, connectHandle);
        socket.on(SOCKET_EVENTS.DISCONNECT, disconnectHandle);
        socket.on(SOCKET_EVENTS.SET_SHOP_STATUS, setStatusHandle);
        socket.on(SOCKET_EVENTS.CONNECT_ERROR, errorHandle);
        socketRef.current = socket;
        return () => {
            socket.off(SOCKET_EVENTS.CONNECTION, connectHandle);
            socket.off(SOCKET_EVENTS.DISCONNECT, disconnectHandle);
            socket.off(SOCKET_EVENTS.SET_SHOP_STATUS, setStatusHandle);
            socket.off(SOCKET_EVENTS.CONNECT_ERROR, errorHandle);
            socket.disconnect();
        };
    }, [url]);

    return { isOpen, val, send: socketRef.current?.send.bind(socketRef.current) };
};

export default useSocketIO;