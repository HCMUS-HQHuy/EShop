import { useSelector } from 'react-redux';

import ApplicationForm from './ApplicationForm.tsx';
import Pending from './PendingComponent.tsx';
import Rejected from './RejectedComponent.tsx';
import Banned from './BannedComponent.tsx';
import styles from './StartSellingPage.module.scss';
import { SHOP_STATUS } from 'src/Types/common.ts';
import type { RootState } from 'src/Types/store.ts';

const StartSelling = () => {
    console.log("StartSelling component rendered");
    const status = useSelector((state: RootState) => state.seller.shopInfo.status);

    const renderContent = () => {
        if (status === null)
            return <ApplicationForm />;
        switch (status) {
            case SHOP_STATUS.PENDING_VERIFICATION:
                return <Pending />;
            case SHOP_STATUS.REJECTED:
                return <Rejected />;
            case SHOP_STATUS.BANNED:
                return <Banned />;
            default:
                return <h1>waiting...{status}</h1>;
        }
    };
    return (
        <div className={styles.startSellingContainer}>
            {renderContent()}
        </div>
    );
};

export default StartSelling;