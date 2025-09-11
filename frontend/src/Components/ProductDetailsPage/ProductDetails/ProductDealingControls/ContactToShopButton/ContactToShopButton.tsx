import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SvgIcon from "src/Components/Shared/MiniComponents/SvgIcon.tsx";
import ToolTip from "src/Components/Shared/MiniComponents/ToolTip.tsx";
import { addToArray, removeByKeyName } from "src/ReduxSlice/productsSlice.tsx";
import { isItemFound } from "src/Functions/helper.ts";
import s from "./ContactToShopButton.module.scss";
import type { ProductDetailType } from "src/Types/product.ts";
import type { RootState } from "src/Types/store.ts";
import { USER_ROLE } from "src/Types/common.ts";
import type { ConversationType } from "src/Types/conversation.ts";
import { addConversation, findConversation, setSelectedConversationId, setTemporaryConversation } from "src/ReduxSlice/conversationSlice.tsx";
import api from "src/Api/index.api.ts";

type Props = {
  productData: ProductDetailType;
};

const ContactToShopButton = ({ productData }: Props) => {
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { selectedConversation } = useSelector((state: RootState) => state.conversation);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  async function contactToShop() {
    if (!loginInfo.isSignIn) navigateTo("/signup");

    const temporaryConversation: ConversationType = {
      id: undefined,
      withUser: {
        userId: productData.sellerId,
        name: productData.shopName,
        role: USER_ROLE.SELLER,
        avatar: 'https://i.pravatar.cc/40?u=tempuser'
      },
      context: { type: "product", productId: productData.id, name: productData.name },
      lastMessage: { sender: 'other', content: '', timestamp: '' },
      unreadCount: 0,
      messages: []
    };

    try {
      dispatch(findConversation(temporaryConversation));
      if (selectedConversation) {
        navigateTo(`/chats?conversationId=${selectedConversation.id}`);
        return;
      }
      const response = await api.chat.getConversation({
        context: temporaryConversation.context,

        participant2Id: productData.sellerId,
        participant2Role: USER_ROLE.SELLER,
        participant1Role: USER_ROLE.CUSTOMER,
      });
      if (response.data.conversation) {
        dispatch(addConversation(response.data.conversation));
        dispatch(setSelectedConversationId(response.data.conversation.id));
        navigateTo(`/chats?conversationId=${response.data.conversation.id}`);
      } else {
        dispatch(setTemporaryConversation(temporaryConversation));
        navigateTo(`/chats?conversationId=temp`);
      }
    } catch (error: any) {
      console.error("Error fetching conversation:", error);
    }
  }

  return (
    <button
      type="button"
      className={`${s.addToFav}`}
      aria-label={t("detailsPage.contact")}
      onClick={contactToShop}
    >
      <div className={s.heartBackground} />
      <SvgIcon name="shop" />
      <ToolTip left="50%" top="60px" content={t("detailsPage.contact")} />
    </button>
  );
};
export default ContactToShopButton;
