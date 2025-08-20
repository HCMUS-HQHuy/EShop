import { Link } from "react-router-dom";
import { WEBSITE_NAME } from "src/Data/constants.tsx";
import useNavToolsProps from "src/Hooks/App/useNavToolsProps.tsx";
import NavTools from "../../Shared/MidComponents/NavTools/NavTools.jsx";
import s from "./Header.module.scss";
import MobileNavIcon from "./MobileNavIcon.jsx";
import Nav from "./Nav.jsx";

const Header = () => {
  const navToolsProps = useNavToolsProps();

  return (
    <header className={s.header} dir="ltr">
      <div className={s.container}>
        <h1>
          <Link to="/">{WEBSITE_NAME}</Link>
        </h1>

        <div className={s.headerContent}>
          <Nav />
          <NavTools {...navToolsProps} />
        </div>

        <MobileNavIcon />
      </div>
    </header>
  );
};

export default Header;
