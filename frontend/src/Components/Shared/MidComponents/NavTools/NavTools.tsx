import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import IconWithCount from "../../NavTools/IconWithCount/IconWithCount.tsx";
import SearchProductsInput from "../../NavTools/SearchInput/SearchProductsInput.tsx";
import UserMenuIcon from "../../NavTools/UserMenuIcon/UserMenuIcon.tsx";
import s from "./NavTools.module.scss";
import type { RootState } from "src/Types/store.ts";

const NavTools = ({ showHeart = true, showCart = true, showUser = true, showChat = true }) => {
  const { t } = useTranslation();
  const { cartProducts, favoritesProducts } = useSelector((state: RootState) => state.products);
  const { conversations } = useSelector((state: RootState) => state.conversation);
  const numberOfUnreadMessages = conversations.reduce((acc, convo) => acc + (convo.unreadCount > 0 ? 1 : 0), 0);

  return (
    <div className={s.navTools}>
      <SearchProductsInput />
      
      <div className={s.tools}>
        <IconWithCount
          props={{
            visibility: showHeart,
            iconName: "heart",
            routePath: "/favorites",
            countLength: favoritesProducts.length,
            title: t("navTools.favorite"),
          }}
        />

        <IconWithCount
          props={{
            visibility: showCart,
            iconName: "cart3",
            routePath: "/cart",
            countLength: cartProducts.length,
            title: t("navTools.cart"),
          }}
        />
        <IconWithCount
          props={{
            visibility: showChat,
            iconName: "chat",
            routePath: "/chats",
            countLength: numberOfUnreadMessages,
            title: t("navTools.chat"),
          }}
        />

        <UserMenuIcon visibility={showUser} />
      </div>
    </div>
  );
};

export default NavTools;
