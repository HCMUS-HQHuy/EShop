import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import useSignOut from "src/Hooks/App/useSignOut.tsx";
import SvgIcon from "../MiniComponents/SvgIcon.tsx";
import s from "./UserMenu.module.scss";
import UserMenuItemWithCount from "./UserMenuItemWithCount.tsx";
import type { AppDispatch, RootState } from "src/Types/store.ts";
import { updateGlobalState } from "src/Features/globalSlice.tsx";
import { SHOP_STATUS, USER_ROLE } from "src/Types/common.ts";
import { conversationFetch } from "src/Features/conversationSlice.tsx";
import { showAlert } from "src/Features/alertsSlice.tsx";

type Props = {
  isActive: boolean;
  toggler: () => void;
}

const UserMenu = ({ isActive, toggler }: Props) => {
  const { wishList, orderProducts } = useSelector((state: RootState) => state.products);
  const { shopInfo } = useSelector((state: RootState) => state.seller);
  const wishListLength = wishList.length;
  const orderProductsLength = orderProducts.length;
  const activeClass = isActive ? s.active : "";
  const navigate = useNavigate();
  const { t } = useTranslation();
  const signOut = useSignOut();
  const dispatch = useDispatch<AppDispatch>();

  function handleSignOut() {
    signOut();
    navigate("/", { replace: true });
  }

  // if (!shopInfo.status) {
  //   console.log("No shop info, redirecting to become-seller");
  //   navigate("/become-seller");
  //   return;
  // }
  function switchModeToSeller() {
    dispatch(updateGlobalState({ key: "userRole", value: USER_ROLE.SELLER }));
    dispatch(conversationFetch(USER_ROLE.SELLER));
  }

  return (
    <div className={`${s.userMenu} ${activeClass}`}>
      <NavLink to="/profile" aria-label="Profile page">
        <SvgIcon name="user" />
        <span>{t("userMenuItems.profile")}</span>
      </NavLink>
      
      {shopInfo.status && 
        <NavLink to="/seller" aria-label="Seller page" onClick={switchModeToSeller}>
          <SvgIcon name="cart" />
          <span>{t("userMenuItems.seller")}</span>
        </NavLink>
      }

      {!shopInfo.status && 
        <NavLink to="/become-seller" aria-label="Seller page">
          <SvgIcon name="cart" />
          <span>{'Become Seller'}</span>
        </NavLink>
      }

      <NavLink to="/order" aria-label="Order page">
        <UserMenuItemWithCount
          props={{
            iconName: "cart",
            title: t("userMenuItems.cart"),
            countLength: orderProductsLength,
          }}
        />
      </NavLink>

      <NavLink to="/cancellations" aria-label="Cancellations page">
        <SvgIcon name="cancel" />
        <span>{t("userMenuItems.cancellations")}</span>
      </NavLink>

      <NavLink to="/reviews" aria-label="Reviews page">
        <SvgIcon name="solidStar" />
        <span>{t("userMenuItems.reviews")}</span>
      </NavLink>

      <NavLink to="/wishlist" aria-label="Wishlist page">
        <UserMenuItemWithCount
          props={{
            iconName: "save",
            title: t("userMenuItems.wishlist"),
            countLength: wishListLength,
          }}
        />
      </NavLink>

      <a href="#" onClick={handleSignOut} onBlur={toggler} aria-label="Logout">
        <SvgIcon name="boxArrowLeft" />
        <span>{t("userMenuItems.logout")}</span>
      </a>
    </div>
  );
};
export default UserMenu;
