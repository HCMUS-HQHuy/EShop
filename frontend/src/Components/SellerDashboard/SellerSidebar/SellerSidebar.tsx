import React, { use } from 'react';
import { useSelector } from 'react-redux';

import { NavLink } from 'react-router-dom';
import s from './SellerSidebar.module.scss';
import { FaTachometerAlt, FaBoxOpen, FaShoppingCart } from 'react-icons/fa';
import type { RootState } from 'src/Types/store.ts';

const iconMap: Record<string, React.ReactElement> = {
  DB: <FaTachometerAlt />,
  PR: <FaBoxOpen />,
  OR: <FaShoppingCart />,
};

const Icon = ({ name }: { name: string }) => (
  <span style={{ marginRight: '8px' }}>{iconMap[name] || null}</span>
);

const SellerSidebar = () => {
  const { name, email } = useSelector((state: RootState) => state.seller.shopInfo);

  return (
    <aside className={s.sidebar}>
      <div className={s.shopInfo}>
        <h3> { name } </h3>
        <p> { email } </p>
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