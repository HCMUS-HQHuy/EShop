import { IS_PRODUCTION } from "src/Data/constants.tsx";
import { handleUpdateFound } from "src/Functions/pwa.ts";
import type { SetStateAction, Dispatch } from "react";

export async function registerSWWithUpdate(setShowNotification: Dispatch<SetStateAction<boolean>>) {
  const isReadToRegister = navigator?.serviceWorker && IS_PRODUCTION;
  if (!isReadToRegister) return;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");

    if (registration.waiting) setShowNotification(true);

    registration.addEventListener("updatefound", () =>
      handleUpdateFound(registration, setShowNotification)
    );
  } catch (err) {
    console.error(`Error registering service worker: ${err}`);
  }
}
