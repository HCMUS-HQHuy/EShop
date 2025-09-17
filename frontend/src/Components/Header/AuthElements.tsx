import { Link } from 'react-router-dom';
import s from './Buttons.module.scss';

const AuthElements = () => {
  return (
    // <button onClick={handleSwitchToUserMode} className={s.backButton}>
    //   Login
    // </button>
    <Link to="/login" className={s.backButton}>Login</Link>
  );
};

export default AuthElements;