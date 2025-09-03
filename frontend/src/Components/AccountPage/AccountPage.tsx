import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
// Import thêm Routes và Route từ react-router-dom
import { Link, Routes, Route, Outlet } from "react-router-dom";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount.tsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.jsx";
import AccountMenuSection from "./AccountMenuSection/AccountMenuSection.tsx";
import s from "./AccountPage.module.scss";
import EditProfileForm from "./EditProfileForm/EditProfileForm.tsx";
// Import component mới để đăng ký shop
import ProfileContentNotFound from "./AccountMenuSection/ProfileContentNotFound/ProfileContentNotFound.tsx";
import type { RootState } from "src/Types/store.ts";

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

           <div className={s.accountPageContent}>
            <AccountMenuSection />
            <div className={s.contentPanel}>
              <EditProfileForm />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AccountPage;