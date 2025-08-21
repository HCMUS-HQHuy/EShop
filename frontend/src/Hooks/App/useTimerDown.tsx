import { useEffect, useRef, useState, createRef } from "react";
import {
  getFormattedTime,
  getTimeInMilliseconds,
  getTimeObj,
} from "src/Functions/time.ts";
import useLocalStorage from "../Helper/useLocalStorage.tsx";

type TimeData =
  | { days: number; hours: number; minutes: number; seconds: number; milliseconds: number }
  | { days: string; hours: string; minutes: string; seconds: string };

/* Props Example
  timeEvent="3 24 60 60" Days-Hours-Minutes-Seconds
  eventName="timerName" localStorage key name
*/

const useTimerDown = (
  downTime: string,
  { timeResetRequired, stopTimer, timerName, formattedTime }: { timeResetRequired: boolean; stopTimer: boolean; timerName: string; formattedTime: boolean }
) => {
  if (!timerName) throw new Error("Timer name is invalid");
  if (timeResetRequired) localStorage.removeItem(timerName);

  const times = downTime.split(" ");
  const timeLocal = useLocalStorage(timerName);
  const timeOrTimeLocal = timeLocal
    ? timeLocal
    : getTimeInMilliseconds(...(times.map((time) => parseInt(time, 10)) as [number, number, number, number]));
  const [time, setTime] = useState(timeOrTimeLocal);

  const [timeData, setTimeData] = useState<TimeData>(getTimeObj(timeOrTimeLocal));
  const [isTimerDone, setIsTimerDone] = useState(false);
  const isMounted = useRef(false);
  const debounceId = useRef<NodeJS.Timeout | null>(null);

  function useEffectTimeUpdater() {
    if (time <= -1000) {
      setIsTimerDone(true);
      return;
    }

    debounceId.current = setTimeout(() => {
      setTime(time - 1000);

      if (formattedTime) {
        setTimeData(getFormattedTime(getTimeObj(time)));
        useLocalStorage(timerName, time);
        return;
      }

      setTimeData(getTimeObj(time));
      useLocalStorage(timerName, time);
    }, 1000);

    return () => {
      if (debounceId.current !== null) {
        clearTimeout(debounceId.current);
      }
    };
  }

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;

      if (formattedTime) {
        setTimeData(getFormattedTime(getTimeObj(time)));
        useLocalStorage(timerName, time);
        useEffectTimeUpdater();
        return;
      }
    }

    if (stopTimer) return;

    useEffectTimeUpdater();
  }, [time]);

  return { timeData, isTimerDone };
};

export default useTimerDown;
