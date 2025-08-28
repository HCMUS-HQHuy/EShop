import { Helmet } from "react-helmet-async";
import { signUpImg } from "src/Assets/Images/Images.ts";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount.tsx";
import s from "./ResetPassword.module.scss";
import ResetPasswordForm from "./ResetPasswordForm/ResetPasswordForm.tsx";

const ResetPassword = () => {
  useScrollOnMount(260);

  return (
    <>
      <Helmet>
        <title>Login in</title>
        <meta
          name="description"
          content={`Log in to your ${WEBSITE_NAME} account to access personalized shopping features, track orders, and manage your account details securely.`}
        />
      </Helmet>

      <main className={s.LogInPage} id="reset-password-page">
        <div className={s.container}>
          <div className={s.imgHolder}>
            <img src={signUpImg} alt="Shopping cart and phone" />
          </div>

          <ResetPasswordForm />
        </div>
      </main>
    </>
  );
};
export default ResetPassword;
