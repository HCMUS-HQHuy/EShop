import { iconsData } from "src/Data/iconsData.tsx";

const SvgIcon = ({ name }: { name: string}) => {
  const iconData = iconsData.find((iconData: { name: string }) => iconData.name === name);
  return iconData && iconData?.icon;
};

export default SvgIcon;
