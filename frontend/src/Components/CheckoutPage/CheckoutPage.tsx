import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import { showAlert } from "src/Features/alertsSlice.tsx";
import { transferCartToOrder, transferProducts } from "src/Features/productsSlice.tsx";
import { blurInputs } from "src/Functions/componentsFunctions.ts";
import {
  isCheckoutFormValid,
  showInvalidInputAlert,
} from "src/Functions/validation.ts";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount.tsx";
import useFormData from "src/Hooks/Helper/useFormData.tsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.tsx";
import BillingDetails from "./BillingDetails/BillingDetails.tsx";
import s from "./CheckoutPage.module.scss";
import PaymentSection from "./PaymentSection/PaymentSection.tsx";
import type { AppDispatch, RootState } from "src/Types/store.ts";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  useScrollOnMount(160);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { saveBillingInfoToLocal, cartProducts } = useSelector(
    (state: RootState) => state.products
  );
  const { values: billingValues, handleChange } = useFormData({
    initialValues: {
      firstName: "",
      companyName: "",
      address: "",
      streetAddress: "",
      cityOrTown: "",
      phoneNumber: "",
      email: "",
    },
    onSubmit: handleSubmitPayment,
    storeInLocalStorage: saveBillingInfoToLocal,
    localStorageKey: "billingInfo",
  });

  const pageHistory = [t("history.products"), t("history.checkout")];
  const historyPaths = [
    {
      index: 0,
      path: "/home",
    },
  ];

  function handleSubmitPayment(event: React.FormEvent<HTMLFormElement>) {
    const activeElement = document.activeElement as HTMLElement | null;
    const isCheckboxFocused = activeElement?.id === "save-info";
    const isInputFocused = activeElement?.tagName === "INPUT";
    const inputs = event.currentTarget.querySelectorAll("input");

    const isCartEmpty = cartProducts.length === 0;
    const isFormValid = isCheckoutFormValid(event);
    event.preventDefault();
    blurInputs(inputs);
    showInvalidInputAlert(event);
    // if (!saveBillingInfoToLocal) localStorage.removeItem("billingInfo");

    if (isInputFocused && isCheckboxFocused) return;
    if (!isFormValid) return;

    if (isCartEmpty) {
      showEmptyCartAlert(dispatch, t);
      return;
    }
    finalizeOrder(dispatch, t);
  }

  return (
    <>
      <Helmet>
        <title>Checkout</title>
        <meta
          name="description"
          content={`Complete your purchase on ${WEBSITE_NAME} by reviewing your cart, adding your shipping details, and choosing payment options such as cash or bank card for a smooth checkout experience.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.checkoutPage} id="checkout-page">
          <PagesHistory history={pageHistory} historyPaths={historyPaths} />

          <form
            method="POST"
            className={s.checkoutPageContent}
            onSubmit={handleSubmitPayment}
          >
            <BillingDetails inputsData={{ billingValues, handleChange }} />
            <PaymentSection />
          </form>
        </main>
      </div>
    </>
  );
};
export default CheckoutPage;

function showEmptyCartAlert(dispatch: AppDispatch, t: any) {
  dispatch(
    showAlert({
      alertState: "warning",
      alertText: t("toastAlert.cartEmpty"),
      alertType: "alert",
    })
  );
}

function finalizeOrder(dispatch: AppDispatch, t: any) {
  dispatch(transferCartToOrder());

  setTimeout(() => {
    dispatch(
      showAlert({
        alertState: "success",
        alertText: t("toastAlert.checkoutSuccess"),
        alertType: "alert",
      })
    );
  }, 600);
}
