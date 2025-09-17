import { useEffect, useRef, useState } from "react";
import { getScrollSliderValue } from "src/Functions/componentsFunctions.ts";
import { buttonEffect } from "src/Functions/effects.ts";

const useSlider = (sliderRef: React.RefObject<HTMLDivElement>) => {
  const isSliderClicked = useRef(false);
  const [isAtFirstSlide, setFirst] = useState(false);
  const [isAtLastSlide, setLast] = useState(false);

  function handlePrevBtn(e: React.MouseEvent<HTMLButtonElement>) {
    if (isAtFirstSlide) return;

    buttonEffect(e);

    if (!isSliderClicked.current) isSliderClicked.current = true;
    else return;
    setTimeout(() => (
      setFirst(isFirstSlide(sliderRef)),
      setLast(isLastSlide(sliderRef)),
      isSliderClicked.current = false
    ), 500);
    sliderRef.current.scrollLeft -= getScrollSliderValue(sliderRef.current);
  }
  
  function handleNextBtn(e: React.MouseEvent<HTMLButtonElement>) {
    if (isAtLastSlide) return;
    
    buttonEffect(e);
    
    if (!isSliderClicked.current) isSliderClicked.current = true;
    else return;
    console.log(isSliderClicked);
    setTimeout(() => (
      setFirst(isFirstSlide(sliderRef)),
      setLast(isLastSlide(sliderRef)),
      isSliderClicked.current = false
    ), 500);

    sliderRef.current.scrollLeft += getScrollSliderValue(sliderRef.current);
  }

  return { isSliderClicked, isAtFirstSlide, isAtLastSlide, handleNextBtn, handlePrevBtn };
};
export default useSlider;

export function isLastSlide(sliderRef: React.RefObject<HTMLDivElement>) {
  if (!sliderRef.current) return true;
  const sliderEle = sliderRef.current;
  return (
    sliderEle.scrollWidth - sliderEle.clientWidth - sliderEle.scrollLeft < 2
  );
}

export function isFirstSlide(sliderRef: React.RefObject<HTMLDivElement>) {
  if (!sliderRef.current) return true;
  const sliderEle = sliderRef.current;
  return sliderEle.scrollLeft <= 1;
}