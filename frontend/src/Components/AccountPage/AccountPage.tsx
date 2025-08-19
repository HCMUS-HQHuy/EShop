import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { WEBSITE_NAME } from "Data/constants.jsx";
import useScrollOnMount from "Hooks/App/useScrollOnMount.jsx";
import PagesHistory from "../Shared/MiniComponents/PagesHistory/PagesHistory.jsx";
import AccountMenuSection from "./AccountMenuSection/AccountMenuSection.jsx";
import s from "./AccountPage.module.scss";
import EditProfileForm from "./EditProfileForm/EditProfileForm.tsx";

import type { RootState } from "Types/store.ts";

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
            <EditProfileForm />
          </div>
        </main>
      </div>
    </>
  );
};
export default AccountPage;
