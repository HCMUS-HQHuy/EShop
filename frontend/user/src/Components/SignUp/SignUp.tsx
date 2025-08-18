import { Helmet } from "react-helmet-async";
import { signUpImg } from "Assets/Images/Images.js";
import { WEBSITE_NAME } from "Data/constants.jsx";
import useScrollOnMount from "Hooks/App/useScrollOnMount.jsx";
import s from "./SignUp.module.scss";
import SignUpForm from "./SignUpForm/SignUpForm.tsx";

const SignUp = () => {
  useScrollOnMount(260);

  return (
    <>
      <Helmet>
        <title>Sign up</title>
        <meta
          name="description"
          content={`Create an ${WEBSITE_NAME} account to enjoy a personalized shopping experience, track your orders, and manage your preferences easily.`}
        />
      </Helmet>

      <main className={s.signUpPage} id="signup-page">
        <div className={s.container}>
          <div className={s.imgHolder}>
            <img src={signUpImg} alt="Shopping cart and phone" />
          </div>

          <SignUpForm />
        </div>
      </main>
    </>
  );
};
export default SignUp;
