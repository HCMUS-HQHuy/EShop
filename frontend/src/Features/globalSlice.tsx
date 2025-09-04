import { createSlice } from "@reduxjs/toolkit";
import { USER_ROLE } from "src/Types/common.ts";

type GlobalState = {
  isOverlayActive: boolean;
  isMobileMenuActive: boolean;
  isProfileMenuActive: boolean;
  isSectionsMenuActive: boolean;
  isZoomInPreviewActive: boolean;
  previewImg: string | null;
  userRole: USER_ROLE;
};

const globalStateStr = localStorage.getItem("globalState");
const initialState = globalStateStr
  ? JSON.parse(globalStateStr) as GlobalState
  : {
      isOverlayActive: false,
      isMobileMenuActive: false,
      isProfileMenuActive: false,
      isSectionsMenuActive: false,
      isZoomInPreviewActive: false,
      previewImg: null,
      userRole: USER_ROLE.CUSTOMER
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
