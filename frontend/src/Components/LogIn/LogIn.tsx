import { Helmet } from "react-helmet-async";
import { signUpImg } from "src/Assets/Images/Images.ts";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useScrollOnMount from "src/Hooks/App/useScrollOnMount.tsx";
import s from "./LogIn.module.scss";
import LogInForm from "./LogInForm/LogInForm.tsx";

const LogIn = () => {
  useScrollOnMount(100);

  return (
    <>
      <Helmet>
        <title>Login in</title>
        <meta
          name="description"
          content={`Log in to your ${WEBSITE_NAME} account to access personalized shopping features, track orders, and manage your account details securely.`}
        />
      </Helmet>

      <main className={s.LogInPage} id="login-page">
        <div className={s.container}>
          <div className={s.imgHolder}>
            <img src={signUpImg} alt="Shopping cart and phone" />
          </div>

          <LogInForm />
        </div>
      </main>
    </>
  );
};
export default LogIn;
