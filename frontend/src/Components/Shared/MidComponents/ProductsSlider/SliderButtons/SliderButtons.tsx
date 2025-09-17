import useSlider from "src/Hooks/App/useSlider.tsx";
import SvgIcon from "../../../MiniComponents/SvgIcon.tsx";
import s from "./SliderButtons.module.scss";

type Props = {
  sliderRef: React.RefObject<HTMLDivElement>;
}

const SliderButtons = ({ sliderRef }: Props) => {
  const { handleNextBtn, handlePrevBtn, isAtFirstSlide, isAtLastSlide } = useSlider(sliderRef as React.RefObject<HTMLDivElement>);
  return (
    <div className={s.sliderButtons}>
      <button
        type="button"
        disabled={isAtFirstSlide}
        onClick={handlePrevBtn}
        aria-label="Previous button for slider"
      >
        <SvgIcon name="arrowLeftShort" />
      </button>

      <button
        type="button"
        disabled={isAtLastSlide}
        onClick={handleNextBtn}
        aria-label="Next button for slider"
      >
        <SvgIcon name="arrowRightShort" />
      </button>
    </div>
  );
};
export default SliderButtons;
