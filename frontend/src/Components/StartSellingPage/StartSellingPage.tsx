import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from './ApplicationForm.tsx';
import PendingPage from './PendingPage.tsx';
import RejectedPage from './RejectedPage.tsx';
import styles from './StartSellingPage.module.scss';
import type { RootState } from 'src/Types/store.ts';
import { SHOP_STATUS } from 'src/Types/common.ts';

const StartSellingPage = () => {
    const navigate = useNavigate();
    const { status } = useSelector((state: RootState) => state.seller.shopInfo);
    useEffect(() => {
        if (status === SHOP_STATUS.ACTIVE || status === SHOP_STATUS.CLOSED) {
            navigate('/seller');
        }
    }, [status, navigate]);

    const renderContent = () => {
        if (status === null)
            return <ApplicationForm />
        switch (status) {
            case SHOP_STATUS.PENDING_VERIFICATION:
                return <PendingPage />;
            case SHOP_STATUS.REJECTED:
                return <RejectedPage />;
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