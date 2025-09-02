import { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./socketEvents.ts";
import type { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

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

const useSocketIO = (namespace: string) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [val, setVal] = useState<any>(null);

    const socketRef = useRef<Socket | null>(null);
    useEffect(() => {
        function connectHandle() {
            console.log("Socket connected");
            setIsOpen(true);
        }
        function disconnectHandle() {
            console.log("Socket disconnected");
            setIsOpen(false);
        }
        function setStatusHandle(data: any) {
            console.log("Message received:", data);
            setVal(data);
        }
        function redirectHandle(data: any) {
            const { url, isRedirect } = data.data[0];
            if (isRedirect === false) return;
            console.log("Redirecting to:", url);
            const width = 1000;
            const height = 700;
            const left = window.screenX + (window.innerWidth - width) / 2;
            const top = window.screenY + (window.innerHeight - height) / 2;
            const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
            
            window.open(url, '_blank', features);
        }

        function receiveMessage(data: any) {
            console.log("Message received:", data);
            setVal(data);
        }

        function errorHandle(error: Error) {
            console.error("Socket connection error:", error);
        }

        const socket: Socket = io(`${import.meta.env.VITE_BACK_END_SOCKET_URL}${namespace}`, { withCredentials: true });
        socket.on(SOCKET_EVENTS.CONNECT, connectHandle);
        socket.on(SOCKET_EVENTS.DISCONNECT, disconnectHandle);
        socket.on(SOCKET_EVENTS.SET_SHOP_STATUS, setStatusHandle);
        socket.on(SOCKET_EVENTS.REDIRECT, redirectHandle);
        socket.on(SOCKET_EVENTS.MESSAGE, receiveMessage);
        socket.on(SOCKET_EVENTS.CONNECT_ERROR, errorHandle);
        socketRef.current = socket;
        return () => {
            if (!socketRef.current) return;
            socket.off(SOCKET_EVENTS.CONNECT, connectHandle);
            socket.off(SOCKET_EVENTS.DISCONNECT, disconnectHandle);
            socket.off(SOCKET_EVENTS.SET_SHOP_STATUS, setStatusHandle);
            socket.off(SOCKET_EVENTS.REDIRECT, redirectHandle);
            socket.off(SOCKET_EVENTS.MESSAGE, receiveMessage);
            socket.off(SOCKET_EVENTS.CONNECT_ERROR, errorHandle);
            socket.disconnect();
        };
    }, [namespace]);

    return { isOpen, val, emit: socketRef.current?.emit.bind(socketRef.current) };
};

export default useSocketIO;