import { useState, useRef, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "./socketEvents.ts";
import type { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "src/Context/SocketContext.tsx";

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

type EventHandler = (data: any) => void;
type Event = keyof typeof SOCKET_EVENTS;

const useSocketIO = () => {
    const socket = useContext<Socket | null>(SocketContext);
    const listenersRef = useRef<Map<Event, EventHandler>>(new Map());

    const listen = (event: Event, handler: EventHandler) => {
        if (!socket) return;
        const oldHandler = listenersRef.current.get(event);
        if (oldHandler) {
            socket.off(event, oldHandler);
        }
        socket.on(event, handler);
        listenersRef.current.set(event, handler);
    };

    useEffect(() => {
        if (!socket) return;
        return () => {
            listenersRef.current.forEach((handler, event) => {
                socket.off(event, handler);
            });
        };
    }, [socket]);
    return { listen };
};

export default useSocketIO;