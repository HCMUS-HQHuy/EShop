import { createSlice } from "@reduxjs/toolkit";
import { APP_MODE } from "src/Types/common.ts";

const globalStateStr = localStorage.getItem("globalState");
const initialState = globalStateStr
  ? JSON.parse(globalStateStr)
  : {
      isOverlayActive: false,
      isMobileMenuActive: false,
      isProfileMenuActive: false,
      isSectionsMenuActive: false,
      isZoomInPreviewActive: false,
      previewImg: null,
      appMode: APP_MODE.USER
  };

const globalSlice = createSlice({
  initialState,
  name: "globalSlice",
  reducers: {
    multiUpdateGlobalState: (state, { payload }) => {
      Object.assign(state, payload);
    },
    updateGlobalState: (state, { payload: { key, value } }) => {
      state[key] = value;
      localStorage.setItem("globalState", JSON.stringify(state));
    },
  },
});

export const { updateGlobalState, multiUpdateGlobalState } =
  globalSlice.actions;
export default globalSlice.reducer;
