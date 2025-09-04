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
        const redirectHandle = (data: any) => {
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

        newSocket.on(SOCKET_EVENTS.CONNECT, onConnect);
        newSocket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
        newSocket.on(SOCKET_EVENTS.CONNECT_ERROR, onError);
        newSocket.on(SOCKET_EVENTS.MESSAGE, newMessageHandler);
        newSocket.on(SOCKET_EVENTS.REDIRECT, redirectHandle);
        newSocket.connect();
        setSocket(newSocket);
        return () => {
            newSocket.off(SOCKET_EVENTS.CONNECT, onConnect);
            newSocket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
            newSocket.off(SOCKET_EVENTS.CONNECT_ERROR, onError);
            newSocket.off(SOCKET_EVENTS.MESSAGE, newMessageHandler);
            newSocket.off(SOCKET_EVENTS.REDIRECT, redirectHandle);
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