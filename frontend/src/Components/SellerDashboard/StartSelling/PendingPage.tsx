import s from './StartSellingPage.module.scss';

const PendingComponent = () => (
  <div className={s.statusContainer}>
    <h2>Application Pending</h2>
    <p>Your request to become a seller has been submitted and is currently under review by our team.</p>
    <p>You will be notified via email once a decision has been made. Thank you for your patience!</p>
  </div>
);

const PendingPage = () => {
  return (
      <div className={s.startSellingContainer}>
          <PendingComponent />
      </div>
  )
}

export default PendingPage;