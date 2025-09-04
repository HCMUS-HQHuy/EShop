import React, { createContext, useContext, useEffect, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, type Socket } from 'socket.io-client';
import { addMessageToConversation } from 'src/Features/conversationSlice.tsx';
import { SOCKET_EVENTS } from 'src/Hooks/Socket/socketEvents.ts';
import type { ConversationMessageType } from 'src/Types/conversation.ts';
import type { AppDispatch, RootState } from 'src/Types/store.ts';

const SocketContext = createContext<Socket | null>(null);

const SocketProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = React.useState<Socket | null>(null);
    const { isSignIn } = useSelector((state: RootState) => state.user.loginInfo);
    const dispatch = useDispatch<AppDispatch>();

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
        const onError = (error: Error) => {
            console.error('Socket error:', error);
        };
        const newMessageHandler = (message: ConversationMessageType) => {
            console.log('New message received:', message);
            dispatch(addMessageToConversation(message));
        };
        newSocket.on(SOCKET_EVENTS.CONNECT, onConnect);
        newSocket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
        newSocket.on(SOCKET_EVENTS.CONNECT_ERROR, onError);
        newSocket.on(SOCKET_EVENTS.MESSAGE, newMessageHandler);
        newSocket.connect();
        setSocket(newSocket);
        return () => {
            newSocket.off(SOCKET_EVENTS.CONNECT, onConnect);
            newSocket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
            newSocket.off(SOCKET_EVENTS.CONNECT_ERROR, onError);
            newSocket.off(SOCKET_EVENTS.MESSAGE, newMessageHandler);
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