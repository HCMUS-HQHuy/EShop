import store from "../App/store.tsx"

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;