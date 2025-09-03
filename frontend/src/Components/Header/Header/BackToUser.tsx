import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { APP_MODE } from 'src/Types/common.ts';
import s from './BackToUser.module.scss';
import { updateGlobalState } from 'src/Features/globalSlice.tsx';

const BackToUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSwitchToUserMode = () => {
    dispatch(updateGlobalState({key: "appMode", value: APP_MODE.USER }));
    navigate('/');
  };

  return (
    <button onClick={handleSwitchToUserMode} className={s.backButton}>
      <span className={s.icon}>&#8644;</span> 
      <span>Switch to Buying</span>
    </button>
  );
};

export default BackToUser;