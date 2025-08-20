import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { SCREEN_SIZES } from "src/Data/globalVariables.tsx";
import {
  menFashionMenuItems,
  otherSectionsMenuItems,
  womenFashionMenuItems,
} from "src/Data/staticData.tsx";
import { camelCase } from "src/Functions/formatting.ts";
import useGetResizeWindow from "src/Hooks/Helper/useGetResizeWindow.tsx";
import DropDownMenu from "./DropDownMenu.tsx";
// import OtherSections from "./OtherSections.tsx";
import s from "./SectionsMenu.module.scss";
import SectionsMenuButton from "./SectionsMenuButton.tsx";
import SectionsMenuCloseBtn from "./SectionsMenuCloseBtn/SectionsMenuCloseBtn.tsx";
import type { RootState } from "src/Types/store.ts";
import type { CategoryInfor } from "src/Types/category.ts"

const OtherSectionsLi = ({ item }: {item: CategoryInfor}) => {
  const itemName = camelCase(item.title);
  const url = `#${itemName}`;
  return (
    <li key={`item-${item.categoryId}`} role="menuitem">
      <a href={url}>{item.title}</a>
    </li>
  );
};

const OtherSections = ({ item }: {item: CategoryInfor}) => {
  const itemName = camelCase(item.title);
  const url = `#${itemName}`;
  return (
    <a href={url} key={`item-${item.categoryId}`}>
      {item.title}
    </a>
    // <li key={`item-${item.categoryId}`} role="menuitem">
    //   <a href={url}>{item.title}</a>
    // </li>
  );
};

const LargeMenu = ({MenuItem}: {MenuItem: CategoryInfor}) => {
  return (
    <DropDownMenu nameMenu={MenuItem.title}>
      <ul className={s.dropDownMenu} role="menu">
        {MenuItem.subCategories.map((item, index) => {
          if (item.subCategories.length === 0) {
            return <OtherSectionsLi key={`item-${index}`} item={item} />;
          }
          return <LargeMenu key={`item-${index}`} MenuItem={item} />;
          // return <OtherSectionsLi key={`item-${index}`} item={item} />;
        })}
      </ul>
    </DropDownMenu>
  );
};

const SectionsMenu = () => {
  const { t } = useTranslation();
  const { isSectionsMenuActive } = useSelector((state: RootState) => state.global);
  const activeClass = isSectionsMenuActive ? s.active : "";
  const { windowWidth } = useGetResizeWindow();

  const { categoryList } = useSelector((state: RootState) => state.categories);

  return (
    <>
      <SectionsMenuButton />

      <aside className={`${s.sectionsMenu} ${activeClass}`}>
        {windowWidth <= SCREEN_SIZES.desktop && <SectionsMenuCloseBtn />}

        <h2>{t("sectionsMenu.title")}</h2>
        {categoryList.map((item, index) => {
          if (item.subCategories.length === 0) {
            return <OtherSections key={`item-${index}`} item={item} />;
          }
          return <LargeMenu key={`item-${index}`} MenuItem={item} />;
        })}

        {/* <DropDownMenu nameMenu={t("sectionsMenu.womenFashion.title")}>
          <ul className={s.dropDownMenu} role="menu">
            {womenFashionMenuItems.map((item, index) => {
              const itemName = camelCase(item.name);
              const itemTrans = t(
                "sectionsMenu.womenFashion.menuItems." + itemName
              );

              return (
                <li key={`item-${index}`} role="menuitem">
                  <a href={item.url}>{itemTrans}</a>
                </li>
              );
            })}
          </ul>
        </DropDownMenu>

        <DropDownMenu nameMenu={t("sectionsMenu.menFashion.title")}>
          <ul className={s.dropDownMenu} role="menu">
            {menFashionMenuItems.map((item, index) => {
              const itemName = camelCase(item.name);
              const itemTrans = t(
                "sectionsMenu.menFashion.menuItems." + itemName
              );
              return (
                <li key={`item-${index}`} role="menuitem">
                  <a href={item.url}>{itemTrans}</a>
                </li>
              );
            })}
          </ul>
        </DropDownMenu>

        <OtherSections data={otherSectionsMenuItems} /> */}
      </aside>
    </>
  );
};

export default SectionsMenu;
