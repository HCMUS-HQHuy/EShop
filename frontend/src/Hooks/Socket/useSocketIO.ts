import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
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
        socket.on("connect", connectHandle);
        socket.on("disconnect", disconnectHandle);
        socket.on("setstatus", setStatusHandle);
        socket.on("connect_error", errorHandle);
        socketRef.current = socket;
        return () => {
            socket.off("connect", connectHandle);
            socket.off("disconnect", disconnectHandle);
            socket.off("setstatus", setStatusHandle);
            socket.off("connect_error", errorHandle);
            socket.disconnect();
        };
    }, [url]);

    return { isOpen, val, send: socketRef.current?.send.bind(socketRef.current) };
};

export default useSocketIO;