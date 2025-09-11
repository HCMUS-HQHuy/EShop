import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ALERT_STATE } from "src/Types/common.ts";

type AlertStateType = {
  alert: {
    isAlertActive: boolean;
    alertText: string;
    alertState: ALERT_STATE;
  };

  confirm: {
    isAlertActive: boolean;
    alertText: string;
    alertState: ALERT_STATE;
    confirmPurpose: string;
  };
};

type ActionType = {
  alertText: string;
  alertState: ALERT_STATE;
  alertType: keyof AlertStateType;
};

type UpdateActionPayload<T extends keyof AlertStateType> = {
  type: T;
  key: keyof AlertStateType[T];
  value: AlertStateType[T][keyof AlertStateType[T]];
};

const initialState: AlertStateType = {
  alert: {
    isAlertActive: false,
    alertText: "",
    alertState: ALERT_STATE.ERROR,
  },

  confirm: {
    isAlertActive: false,
    alertText: "",
    alertState: ALERT_STATE.WARNING,
    confirmPurpose: "",
  },
};

const alertsSlice = createSlice({
  name: "alertsSlice",
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<ActionType>) => {
      const { alertText, alertState, alertType } = action.payload;
      state[alertType].alertText = alertText;
      state[alertType].alertState = alertState;
      state[alertType].isAlertActive = true;
    },
    updateAlertState: <T extends keyof AlertStateType>(
      state: AlertStateType,
      action: PayloadAction<UpdateActionPayload<T>>
    ) => {
      const { type, key, value } = action.payload;
      state[type][key] = value;
    },
  },
});

export const { showAlert, updateAlertState } = alertsSlice.actions;
export default alertsSlice.reducer;
