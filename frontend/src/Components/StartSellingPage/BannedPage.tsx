import { useDispatch, useSelector } from 'react-redux';
import styles from './StartSellingPage.module.scss';
import type { RootState } from 'src/Types/store.ts';

const RejectedPage = () => {
  const dispatch = useDispatch();
//   const { rejectionReason } = useSelector((state: RootState) => state.user);
  const rejectionReason = "From HQH";

  return (
    <div className={styles.statusContainer}>
      <h2>BANNED</h2>
      <p>We regret to inform you that your application to become a seller was not approved at this time.</p>
      {rejectionReason && (
        <div className={styles.reasonBox}>
          <strong>Reason from Administrator:</strong>
          <p>"{rejectionReason}"</p>
        </div>
      )}
    </div>
  );
};

export default RejectedPage;