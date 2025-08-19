import { Outlet } from "react-router-dom";
import Footer from "../Components/Footer/Footer.jsx";
import FirstHeader from "../Components/Header/FirstHeader/FirstHeader.tsx";
import Header from "../Components/Header/Header/Header.tsx";
import UpdateNotification from "../Components/PWA/UpdateNotification/UpdateNotification.jsx";
import ConnectionLabelAlert from "../Components/Shared/MiniComponents/ConnectionLabelAlert/ConnectionLabelAlert.jsx";
import GlobalOverlay from "../Components/Shared/MiniComponents/GlobalOverlay/GlobalOverlay.jsx";
import ScrollToTop from "../Components/Shared/MiniComponents/ScrollToTop/ScrollToTop.jsx";
import SkipContentLink from "../Components/Shared/MiniComponents/SkipContentLink.jsx";
import MobileNav from "../Components/Shared/MobileNav/MobileNav.jsx";
import ToastAlert from "../Components/Shared/PopUps/ToastAlert/ToastAlert.jsx";
import ToastConfirm from "../Components/Shared/PopUps/ToastConfirm/ToastConfirm.jsx";
import useCurrentSkipLinkId from "../Hooks/App/useCurrentSkipLinkId.jsx";
import useOnlineStatus from "../Hooks/Helper/useOnlineStatus.jsx";

const RoutesLayout = () => {
  const skipLinkSectionId = useCurrentSkipLinkId();
  const isWebsiteOnline = useOnlineStatus();

  return (
    <div className="App" tabIndex={-1}>
      <SkipContentLink scrollTo={skipLinkSectionId} />
      <UpdateNotification />
      <FirstHeader />
      <Header />
      <MobileNav />
      <GlobalOverlay />
      <ScrollToTop />
      <Outlet />
      <Footer />
      <ConnectionLabelAlert isOnline={isWebsiteOnline} />
      <ToastAlert />
      <ToastConfirm />
    </div>
  );
};
export default RoutesLayout;
