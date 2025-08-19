import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
// Import thêm Routes và Route từ react-router-dom
import { Link, Routes, Route, Outlet } from "react-router-dom";
import { WEBSITE_NAME } from "Data/constants.jsx";
import useScrollOnMount from "Hooks/App/useScrollOnMount.jsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.jsx";
import AccountMenuSection from "./AccountMenuSection/AccountMenuSection.tsx";
import s from "./AccountPage.module.scss";
import EditProfileForm from "./EditProfileForm/EditProfileForm.tsx";
// Import component mới để đăng ký shop
import OpenShopForm from "./OpenShopForm/OpenShopForm.tsx";
import ProfileContentNotFound from "./AccountMenuSection/ProfileContentNotFound/ProfileContentNotFound.tsx";
import type { RootState } from "Types/store.ts";

const AccountLayout = () => {
  return (
    <div className={s.accountPageContent}>
      <AccountMenuSection />
      <div className={s.contentPanel}>
        <Outlet />
      </div>
    </div>
  );
};

const AccountPage = () => {
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { t } = useTranslation();

  useScrollOnMount();

  return (
    <>
      <Helmet>
        <title>Profile</title>
        <meta
          name="description"
          content={`Update your personal information easily on ${WEBSITE_NAME}. Manage your account details, shipping addresses, and preferences for a personalized shopping experience.`}
        />
      </Helmet>

      <div className="container">
        <main className={s.accountPage} id="account-page">
          <div className={s.wrapper}>
            <PagesHistory history={["/", t("nav.profile")]} historyPaths={undefined} />

            <p className={s.welcomeMessage}>
              {t("common.welcome")}
              {"! "}
              <Link to="/profile">{loginInfo.username}</Link>
            </p>
          </div>

          <Routes>
            <Route path="/" element={<AccountLayout />}>
              <Route index element={<EditProfileForm />} />
              <Route path="open-shop" element={<OpenShopForm />} />
              <Route path="*" element={<ProfileContentNotFound />} />
            </Route>
          </Routes>
        </main>
      </div>
    </>
  );
};

export default AccountPage;