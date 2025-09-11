import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
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

type UpdateActionPayload<T extends keyof GlobalState> = {
  key: T;
  value: GlobalState[T];
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
    updateGlobalState: <T extends keyof GlobalState>(
      state: GlobalState,
      action: PayloadAction<UpdateActionPayload<T>>
    )  => {
      const { key, value } = action.payload;
      state[key] = value;
      localStorage.setItem("globalState", JSON.stringify(state));
    },
  },
});

export const { updateGlobalState, multiUpdateGlobalState } =
  globalSlice.actions;
export default globalSlice.reducer;
