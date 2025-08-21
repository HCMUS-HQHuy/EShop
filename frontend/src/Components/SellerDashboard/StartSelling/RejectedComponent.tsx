import { useDispatch, useSelector } from 'react-redux';
// import { resetApplicationStatus } from 'path/to/your/userSlice';
import styles from './StartSellingPage.module.scss';
import type { RootState } from 'src/Types/store.ts';

const RejectedComponent = () => {
  const dispatch = useDispatch();
//   const { rejectionReason } = useSelector((state: RootState) => state.user);
  const rejectionReason = "From HQH";

  const handleReapply = () => {
    // dispatch(resetApplicationStatus());
  };

  return (
    <div className={styles.statusContainer}>
      <h2>Application Not Approved</h2>
      <p>We regret to inform you that your application to become a seller was not approved at this time.</p>
      {rejectionReason && (
        <div className={styles.reasonBox}>
          <strong>Reason from Administrator:</strong>
          <p>"{rejectionReason}"</p>
        </div>
      )}
      {/* <button onClick={handleReapply} className={styles.submitButton}>
        Submit a New Application
      </button> */}
    </div>
  );
};

export default RejectedComponent;