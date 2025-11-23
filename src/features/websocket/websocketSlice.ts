import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WSState {
  connected: boolean;
  lastMessageTs: number | null;
  deltas: Record<
    string,
    { price: number; ts: number; change24h?: number; volume?: number }
  >;
}

const initialState: WSState = {
  connected: false,
  lastMessageTs: null,
  deltas: {},
};

const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    pushDelta(
      state,
      action: PayloadAction<{
        pair: string;
        price: number;
        ts: number;
        change24h?: number;
        volume?: number;
      }>
    ) {
      state.lastMessageTs = action.payload.ts;
      state.deltas[action.payload.pair] = {
        price: action.payload.price,
        ts: action.payload.ts,
        ...(action.payload.change24h !== undefined && {
          change24h: action.payload.change24h,
        }),
        ...(action.payload.volume !== undefined && {
          volume: action.payload.volume,
        }),
      };
    },
    clearDeltas(state) {
      state.deltas = {};
    },
  },
});

export const { setConnected, pushDelta, clearDeltas } = websocketSlice.actions;
export default websocketSlice.reducer;
