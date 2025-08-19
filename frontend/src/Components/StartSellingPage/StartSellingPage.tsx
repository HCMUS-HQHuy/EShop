import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useScrollOnMount from 'Hooks/App/useScrollOnMount.jsx';
import ApplicationForm from './ApplicationForm.tsx';
import PendingPage from './PendingPage.tsx';
import RejectedPage from './RejectedPage.tsx';
import styles from './StartSellingPage.module.scss';
import type { RootState } from 'Types/store.ts';

const StartSellingPage = () => {
    const navigate = useNavigate();
    const { sellerStatus } = useSelector((state: RootState) => state.seller.shopInfo);
    useEffect(() => {
        if (sellerStatus === 'approved') {
            navigate('/seller');
        }
    }, [sellerStatus, navigate]);
    if (sellerStatus === '') {
        useScrollOnMount(100);
    } else useScrollOnMount(0);

    const renderContent = () => {
        switch (sellerStatus) {
            case 'pending':
                return <PendingPage />;
            case 'rejected':
                return <RejectedPage />;
            case '':
                return <ApplicationForm />;
            default:
                return <div>Loading...</div>; 
        }
    };

    return (
        <div className={styles.startSellingContainer}>
            {renderContent()}
        </div>
    );
};

export default StartSellingPage;