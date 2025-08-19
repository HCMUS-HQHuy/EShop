import { NavLink } from 'react-router-dom';
import s from './SellerSidebar.module.scss';

// Trong thực tế, bạn có thể dùng một thư viện icon như react-icons
const Icon = ({ name }: { name: string }) => <span>{`[${name}]`}</span>;

const SellerSidebar = () => {
  return (
    <aside className={s.sidebar}>
      <div className={s.shopInfo}>
        <h3>My EShop Store</h3>
        <p>seller@example.com</p>
      </div>
      <nav className={s.nav}>
        <NavLink to="dashboard" end>
          <Icon name="DB" /> Dashboard
        </NavLink>
        <NavLink to="products">
          <Icon name="PR" /> Products
        </NavLink>
        <NavLink to="orders">
          <Icon name="OR" /> Orders
        </NavLink>
      </nav>
    </aside>
  );
};

export default SellerSidebar;