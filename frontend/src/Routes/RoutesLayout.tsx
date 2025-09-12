import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "src/Components/Footer/Footer.tsx";
import Header from "src/Components/Header/Header/Header.tsx";
import UpdateNotification from "src/Components/PWA/UpdateNotification/UpdateNotification.tsx";
import ConnectionLabelAlert from "src/Components/Shared/MiniComponents/ConnectionLabelAlert/ConnectionLabelAlert.tsx";
import GlobalOverlay from "src/Components/Shared/MiniComponents/GlobalOverlay/GlobalOverlay.tsx";
import ScrollToTop from "src/Components/Shared/MiniComponents/ScrollToTop/ScrollToTop.tsx";
import SkipContentLink from "src/Components/Shared/MiniComponents/SkipContentLink.tsx";
import MobileNav from "src/Components/Shared/MobileNav/MobileNav.tsx";
import ToastAlert from "src/Components/Shared/PopUps/ToastAlert/ToastAlert.tsx";
import ToastConfirm from "src/Components/Shared/PopUps/ToastConfirm/ToastConfirm.tsx";
import useCurrentSkipLinkId from "src/Hooks/App/useCurrentSkipLinkId.tsx";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";
import { USER_ROLE } from "src/Types/common.ts";
import type { RootState } from "src/Types/store.ts";

const RoutesLayout = () => {
  const skipLinkSectionId = useCurrentSkipLinkId();
  const isWebsiteOnline = useOnlineStatus();
  const userRole = useSelector((state: RootState) => state.global.userRole);
  const pathname: string = useLocation().pathname;
  return (
    <div className="App" tabIndex={-1}>
      <SkipContentLink scrollTo={skipLinkSectionId} />
      <UpdateNotification />
      {/* <FirstHeader /> */}
      <Header />
      <MobileNav />
      <GlobalOverlay />
      <ScrollToTop />
      <Outlet />
      { userRole === USER_ROLE.CUSTOMER && !pathname.startsWith('/chat') && <Footer /> }
      <ConnectionLabelAlert isOnline={isWebsiteOnline} />
      <ToastAlert />
      <ToastConfirm />
    </div>
  );
};
export default RoutesLayout;
