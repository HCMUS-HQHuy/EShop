import { Link } from "react-router-dom";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useNavToolsProps from "src/Hooks/App/useNavToolsProps.tsx";
import NavTools from "../../Shared/MidComponents/NavTools/NavTools.jsx";
import s from "./Header.module.scss";
import MobileNavIcon from "./MobileNavIcon.jsx";
import Nav from "./Nav.jsx";
import type { RootState } from "src/Types/store.ts";
import { useSelector } from "react-redux";
import { APP_MODE } from "src/Types/common.ts";
import BackToUser from "./BackToUser.tsx";

const Header = () => {
  const navToolsProps = useNavToolsProps();
  const { appMode } = useSelector((state: RootState) => state.global);
  const { name } = useSelector((state: RootState) => state.seller.shopInfo);
  const headerName = appMode === APP_MODE.SELLER ? name : WEBSITE_NAME;
  const headerNameLink = appMode === APP_MODE.SELLER ? "/seller" : "/";

  return (
    <header className={s.header} dir="ltr">
      <div className={s.container}>
        <h1>
          <Link to={headerNameLink}>{headerName}</Link>
        </h1>

        <div className={s.headerContent}>
          <Nav />
          { appMode === APP_MODE.USER && <NavTools {...navToolsProps} /> }
          { appMode === APP_MODE.SELLER && <BackToUser/>}
        </div>

        <MobileNavIcon />
      </div>
    </header>
  );
};

export default Header;
