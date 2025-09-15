import React, { createContext, useEffect, type FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, type Socket } from 'socket.io-client';
import { addConversation, addMessageToConversation } from 'src/ReduxSlice/conversationSlice.tsx';
import { setShopStatus } from 'src/ReduxSlice/sellerSlice.tsx';
import { SOCKET_EVENTS } from 'src/Hooks/Socket/socketEvents.ts';
import type { ConversationMessageType, ConversationType } from 'src/Types/conversation.ts';
import type { AppDispatch, RootState } from 'src/Types/store.ts';
import { showAlert } from 'src/ReduxSlice/alertsSlice.tsx';
import { ALERT_STATE } from 'src/Types/common.ts';

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
            console.log('Socket connected', newSocket.id);
        };
        const onDisconnect = () => {
            console.log('Socket disconnected');
        };
        const onError = (error: Error) => {
            console.error('Socket error:', error);
        };
        const newConversationHandler = (data: ConversationType) => {
            console.log("New conversation received:", data);
            if (data) {
                dispatch(addConversation(data));
            } else {
                console.warn("Received new conversation event without newConversation data:", data);
            }
        }
        const newMessageHandler = (message: ConversationMessageType) => {
            console.log('New message received:', message);
            dispatch(addMessageToConversation(message));
        };
        const redirectHandle = (data: any) => {
            if (data.error) {
                dispatch(showAlert({alertState: ALERT_STATE.ERROR, alertText: data.error, alertType: "alert"}));
            }
            const { url, isRedirect } = data.data;
            if (isRedirect === false) {

                return;
            }
            console.log("Redirecting to:", url);
            const width = 1000;
            const height = 700;
            const left = window.screenX + (window.innerWidth - width) / 2;
            const top = window.screenY + (window.innerHeight - height) / 2;
            const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
            window.open(url, '_blank', features);
        }

        const setShopStatusHandle = (data: any) => {
            const { status } = data;
            console.log("Shop status updated:", status);
            dispatch(setShopStatus(status));
        }

        newSocket.on(SOCKET_EVENTS.CONNECT, onConnect);
        newSocket.on(SOCKET_EVENTS.SET_SHOP_STATUS, setShopStatusHandle);
        newSocket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect);
        newSocket.on(SOCKET_EVENTS.CONNECT_ERROR, onError);
        newSocket.on(SOCKET_EVENTS.MESSAGE, newMessageHandler);
        newSocket.on(SOCKET_EVENTS.REDIRECT, redirectHandle);
        newSocket.on(SOCKET_EVENTS.NEW_CONVERSATION, newConversationHandler);
        newSocket.connect();
        setSocket(newSocket);
        return () => {
            newSocket.off(SOCKET_EVENTS.CONNECT, onConnect);
            newSocket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect);
            newSocket.off(SOCKET_EVENTS.CONNECT_ERROR, onError);
            newSocket.off(SOCKET_EVENTS.MESSAGE, newMessageHandler);
            newSocket.off(SOCKET_EVENTS.REDIRECT, redirectHandle);
            newSocket.off(SOCKET_EVENTS.SET_SHOP_STATUS, setShopStatusHandle);
            newSocket.off(SOCKET_EVENTS.NEW_CONVERSATION, newConversationHandler);
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