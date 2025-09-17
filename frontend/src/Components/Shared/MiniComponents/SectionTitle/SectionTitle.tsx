import React from "react";
import s from "./SectionTitle.module.scss";
import SliderButtons from "../../MidComponents/ProductsSlider/SliderButtons/SliderButtons.tsx";
import useSlider from "src/Hooks/App/useSlider.tsx";

type Props = {
  eventName: string;
  sectionName?: string;
  type?: 1 | 2;
  sliderRef?: React.RefObject<HTMLDivElement>;
}

const SectionTitle = ({ eventName, sectionName, type = 1, sliderRef = undefined }: Props) => {
  const type2Class = type === 2 ? s.type2 : "";

  return (
    <div className={`${s.sectionTitle} ${type2Class}`}>
      <div className={s.event} data-event-name={eventName}>
        {eventName}
      </div>
      <div className={s.section}>
        <b>{sectionName}</b>
        {sliderRef && 
          <SliderButtons sliderRef={sliderRef}/>
        }
      </div>

    </div>
  );
};
export default SectionTitle;
