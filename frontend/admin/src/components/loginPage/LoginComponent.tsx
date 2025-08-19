import { FaReact } from "react-icons/fa6";
import {
    InputWithLabel,
    SimpleInput
} from "..";
import { useSelector, useDispatch } from "react-redux";
import { authSchemas } from "../../types/credentials";
import { loginAdmin, setLoginData } from "../../features/userSlice";
import { updateInput } from "../../features/formsSlice";
import type { RootState, AppDispatch } from "../../types/store";
import type { LoginFormValues } from "../../types/credentials";

const LoginComponent = () => {
    const { emailOrPhone, password } = useSelector((state: RootState) => state.form.login);
    const dispatch = useDispatch<AppDispatch>();

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const result = authSchemas.login.safeParse({
            email: emailOrPhone,
            password: password
        });
        if (!result.success) {
            console.log("Invalid login credentials");
            return;
        }
        const credentials: LoginFormValues = result.data;
        await dispatch(loginAdmin(credentials));
        const response = await dispatch(setLoginData());
        console.log("Login data set:", response);
    }

    function updateInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        dispatch(
            updateInput({
                formName: "login",
                key: e.target.name,
                value: e.target.value,
            })
        );
    }

    return (
        <div className="w-full max-w-md bg-white dark:bg-gray-800 flex flex-col items-center justify-center p-8 md:p-12 rounded-2xl shadow-2xl">
            <div className="flex flex-col items-center gap-4 mb-8">
                <FaReact className="text-6xl text-cyan-500 hover:rotate-180 transition-transform duration-1000 ease-in-out cursor-pointer" />
                <h2 className="text-3xl dark:text-white text-gray-800 font-bold max-sm:text-2xl">
                    Welcome Back!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                    Login to your EShop dashboard.
                </p>
            </div>

            <form className="w-full flex flex-col gap-6" onSubmit={login}>
                <div className="w-full flex flex-col gap-5">
                    <InputWithLabel label="Email">
                        <SimpleInput name="emailOrPhone" type="email" placeholder="Enter your email..." value={emailOrPhone} onChange={updateInputOnChange} />
                    </InputWithLabel>

                    <InputWithLabel label="Password">
                        <SimpleInput name="password" type="password" placeholder="Enter your password..." value={password} onChange={updateInputOnChange} />
                    </InputWithLabel>
                </div>

                <button
                    type="submit"
                    className="dark:bg-whiteSecondary bg-blackPrimary w-full py-3 text-lg dark:hover:bg-white hover:bg-gray-800 duration-200 flex items-center justify-center gap-x-2"
                >
                    Login Now
                </button>
            </form>
        </div>
    );
}

export default LoginComponent;