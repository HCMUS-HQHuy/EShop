import { FaReact } from "react-icons/fa6";
import {
  InputWithLabel,
  SimpleInput,
  WhiteButton,
} from "../components";
import { useState } from "react";

const LoginComponent = () => {
    const [ email, setEmail ] = useState("john@email.com");
    const [ password, setPassword ] = useState("pass1234567890");
    
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

            <form className="w-full flex flex-col gap-6">
                <div className="w-full flex flex-col gap-5">
                    <InputWithLabel label="Email">
                        <SimpleInput type="email" placeholder="Enter your email..." value={email} onChange={(e) => setEmail(e.target.value)} />
                    </InputWithLabel>

                    <InputWithLabel label="Password">
                        <SimpleInput type="password" placeholder="Enter your password..." value={password} onChange={(e) => setPassword(e.target.value)} />
                    </InputWithLabel>
                </div>

                <WhiteButton
                    link="/"
                    textSize="lg"
                    width="full"
                    py="3"
                    text="Login Now"
                ></WhiteButton>
            </form>
        </div>
    );
}

export default LoginComponent;