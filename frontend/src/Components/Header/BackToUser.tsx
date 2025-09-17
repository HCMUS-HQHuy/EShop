import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { USER_ROLE } from 'src/Types/common.ts';
import s from './Buttons.module.scss';
import { updateGlobalState } from 'src/ReduxSlice/globalSlice.tsx';
import { conversationFetch } from 'src/ReduxSlice/conversationSlice.tsx';
import type { AppDispatch } from 'src/Types/store.ts';

const BackToUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSwitchToUserMode = () => {
    dispatch(updateGlobalState({key: "userRole", value: USER_ROLE.CUSTOMER }));
    dispatch(conversationFetch(USER_ROLE.CUSTOMER));
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