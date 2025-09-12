import { useRef, useState } from "react";
import { SCREEN_SIZES } from "src/Data/globalVariables.tsx";
import useEventListener from "src/Hooks/Helper/useEventListener.tsx";
import ToolTip from "../../Shared/MiniComponents/ToolTip.tsx";
import s from "./PaymentCards.module.scss";

type Props = {
  paymentCards: {
    img: string,
    alt: string,
    link: string,
    id: number
  }[]
}

const PaymentCards = ({ paymentCards }: Props) => {
  const [isLaptopScreen, setIsLaptopScreen] = useState(
    window.innerWidth >= SCREEN_SIZES.laptop
  );
  const debounceId = useRef<NodeJS.Timeout | undefined>(undefined);

  useEventListener(window, "resize", () => {
    clearTimeout(debounceId.current);

    debounceId.current = setTimeout(() => {
      setIsLaptopScreen(window.innerWidth >= SCREEN_SIZES.laptop);
    }, 100);
  });

  console.log("payment cards", paymentCards);

  return (
    <div className={s.images}>
      {paymentCards.map(({ img, alt, link, id }) => (
        <a key={id} href={link} target="_blank">
          {/* {img && img.length > 1 && <img src={img} alt={alt + " image"} /> } */}
          {isLaptopScreen && <ToolTip left="50%" top="46px" content={alt} />}
        </a>
      ))}
    </div>
  );
};
export default PaymentCards;
