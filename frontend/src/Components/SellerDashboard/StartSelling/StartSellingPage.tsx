import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from './ApplicationForm.tsx';
import PendingPage from './PendingPage.tsx';
import RejectedPage from './RejectedPage.tsx';
import BannedPage from './BannedPage.tsx';
import styles from './StartSellingPage.module.scss';
import type { RootState } from 'src/Types/store.ts';
import { SHOP_STATUS } from 'src/Types/common.ts';
import useSocketIO from 'src/Hooks/Socket/useSocketIO.ts';

const StartSellingPage = () => {
    const navigate = useNavigate();
    const { isOpen, val } = useSocketIO('http://localhost:8220/seller');
    const { status } = useSelector((state: RootState) => state.seller.shopInfo);
    useEffect(() => {
        if (status === SHOP_STATUS.ACTIVE || status === SHOP_STATUS.CLOSED) {
            // navigate('/seller');
            console.log("Navigating to seller dashboard");
        }
    }, [status]);

    useEffect(() => {
        console.log("Socket connection status:", isOpen);
        console.log("Received value from socket:", val);       
    }, [val, isOpen]);

    const renderContent = () => {
        if (status === null)
            return <ApplicationForm />
        switch (status) {
            case SHOP_STATUS.PENDING_VERIFICATION:
                return <PendingPage />;
            case SHOP_STATUS.REJECTED:
                return <RejectedPage />;
            case SHOP_STATUS.BANNED:
                return <BannedPage />;
            default:
                return <h1>waiting...</h1>;
        }
    };

    return (
        <div className={styles.startSellingContainer}>
            {renderContent()}
        </div>
    );
};

export default StartSellingPage;