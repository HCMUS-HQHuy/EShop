import { RiseLoader } from "react-spinners";

export function LoadingPage() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <RiseLoader
                color="#36d7b7"
                cssOverride={{ display: "block" }}
                loading
                margin={10}
                size={50}
                speedMultiplier={1}
            />
        </div>
    );
}

export default LoadingPage;