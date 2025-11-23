import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./table/tableSlice";
import websocketReducer from "./websocket/websocketSlice";
import uiReducer from "./ui/uiSlice";

export const store = configureStore({
  reducer: {
    table: tableReducer,
    websocket: websocketReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
