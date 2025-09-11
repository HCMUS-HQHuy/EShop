import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { getRandomItem } from "src/Functions/helper.ts";

type UseUpdateLoadingProps = {
  loadingState: any; // Replace 'any' with the actual type if known
  loadingKey: string;
  cleanFunction?: () => void;
  delays: number[];
  dependencies?: any[];
  actionMethod: (payload: { key: any; value: any }) => any;
};

const useUpdateLoadingState = ({
  loadingState,
  loadingKey,
  cleanFunction,
  delays,
  dependencies = [],
  actionMethod,
}: UseUpdateLoadingProps) => {
  const dispatch = useDispatch();
  const debounceId = useRef<NodeJS.Timeout | null>(null);
  let randomDelay = getRandomItem(delays);

  function updateLoadingState() {
    if (!loadingState) return;

    debounceId.current = setTimeout(() => {
      dispatch(actionMethod({ key: loadingKey, value: false }));
    }, randomDelay);

    randomDelay = getRandomItem(delays);
  }

  function useEffectFunction() {
    updateLoadingState();

    return () => {
      if (debounceId.current !== null) {
        clearTimeout(debounceId.current);
      }
      if (cleanFunction) cleanFunction();
    };
  }

  useEffect(useEffectFunction, dependencies);
};
export default useUpdateLoadingState;
