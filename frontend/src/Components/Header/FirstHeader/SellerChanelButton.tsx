import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import s from './SellerChannelButton.module.scss';
import type { RootState } from 'Types/store.ts';

const SellerChannelButton = () => {
    const userLogin = useSelector((state: RootState) => state.user.loginInfo);
    const navigateTo = useNavigate();
    // 2. Hàm xử lý điều hướng
    const handleNavigation = () => {
        // navigateTo(userInfo.isSellerActive ? '/seller-channel' : '/become-seller');
        navigateTo('/become-seller');
    };

    return (
        <div className={s.sellerButtonContainer}> {/* Sử dụng một class container mới */}
            <button
                type="button"
                className={s.sellerButton} // Sử dụng một class mới cho nút
                onClick={handleNavigation}
            >
                {/* Hiển thị văn bản khác nhau tùy thuộc vào trạng thái của người dùng */}
                {/* {userLogin.isSellerActive ? "Seller Centre" : "Start Selling"} */}
                { "Start Selling"}
            </button>
        </div>
    );
};

export default SellerChannelButton;