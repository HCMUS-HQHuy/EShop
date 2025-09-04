import React, { createContext, useContext, useEffect, type FC } from 'react';
import { useSelector } from 'react-redux';
import { io, type Socket } from 'socket.io-client';
import { SOCKET_EVENTS } from 'src/Hooks/Socket/socketEvents.ts';
import type { RootState } from 'src/Types/store.ts';

const SocketContext = createContext<Socket | null>(null);

const SocketProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const { isSignIn } = useSelector((state: RootState) => state.user.loginInfo);

    useEffect(() => {
        if (!isSignIn) return;

        const newSocket: Socket = io(`${import.meta.env.VITE_BACK_END_SOCKET_URL}`, {
            withCredentials: true,
            autoConnect: false,
        });

        const onConnect = () => {
            console.log('Socket connected');
        };
        const onDisconnect = () => {
            console.log('Socket disconnected');
        };

        newSocket.on(SOCKET_EVENTS.CONNECT, onConnect);
        newSocket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
        newSocket.connect();
        setSocket(newSocket);
        return () => {
            newSocket.off(SOCKET_EVENTS.CONNECT, onConnect);
            newSocket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
            newSocket.disconnect();
        };
    }, [isSignIn]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export { SocketProvider, SocketContext };