import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import App from "./App.tsx";
import AppLoader from "./AppLoader.tsx";
import { store } from "./App/store.tsx";
import "./Styles/main.scss";
import "./i18n.js";
import { SocketProvider } from "./Context/SocketContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <AppLoader>
          <SocketProvider>
            <App />
          </SocketProvider>
        </AppLoader>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);
