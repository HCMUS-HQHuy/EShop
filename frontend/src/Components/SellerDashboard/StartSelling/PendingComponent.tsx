import styles from './StartSellingPage.module.scss';

const PendingComponent = () => (
  <div className={styles.statusContainer}>
    <h2>Application Pending</h2>
    <p>Your request to become a seller has been submitted and is currently under review by our team.</p>
    <p>You will be notified via email once a decision has been made. Thank you for your patience!</p>
  </div>
);

export default PendingComponent;