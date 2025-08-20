import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { TIME_UNITS } from "src/Data/globalVariables.tsx";
import useTimerDown from "Hooks/App/useTimerDown.jsx";
import s from "./EventCounter.module.scss";

interface EventCounterProps {
  timeEvent: Date | string | number;
  eventName: string;
}

const EventCounter = ({ timeEvent, eventName }: EventCounterProps) => {
  const { t } = useTranslation();
  const { timeData } = useTimerDown(timeEvent, {
    timerName: eventName,
    formattedTime: true,
    timeResetRequired: false,
    stopTimer: false,
  });

  return (
    <section className={s.eventTimer}>
      {TIME_UNITS.map((unit, index) => (
        <Fragment key={unit}>
          {index !== 0 && <span>:</span>}
          <div className={s.timeContainer}>
            <span className={s.typeTime}>{t(`common.${unit}`)}</span>
            <span className={s.time}>{timeData[unit]}</span>
          </div>
        </Fragment>
      ))}
    </section>
  );
};
export default EventCounter;
