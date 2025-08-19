import { Link } from 'react-router-dom';
import s from './ProfileContentNotFound.module.scss';

const ProfileContentNotFound = () => {
  return (
    <div className={s.notFoundContainer}>
      <h3>404 - Content Not Found</h3>
      <p>The section you are looking for does not exist within your profile.</p>
      <Link to="/profile">Go back to your profile</Link>
    </div>
  );
};

export default ProfileContentNotFound;