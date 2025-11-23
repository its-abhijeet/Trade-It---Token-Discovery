import { Token } from "@/services/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SortDirection = "asc" | "desc" | null;

interface TableState {
  items: Token[]; // minimal typing for now
  loading: boolean;
  error: string | null;
  category: "all" | "new" | "final" | "migrated";
  sortBy: string | null;
  sortDir: SortDirection;
}

const initialState: TableState = {
  items: [],
  loading: false,
  error: null,
  category: "new",
  sortBy: "volume",
  sortDir: "desc",
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Token[]>) {
      state.items = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setCategory(state, action: PayloadAction<TableState["category"]>) {
      state.category = action.payload;
    },
    setSort(
      state,
      action: PayloadAction<{ sortBy: string; sortDir: SortDirection }>
    ) {
      state.sortBy = action.payload.sortBy;
      state.sortDir = action.payload.sortDir;
    },
    updatePrice(
      state,
      action: PayloadAction<{ pair: string; price: number; ts: number }>
    ) {
      const idx = state.items.findIndex((i) => i.pair === action.payload.pair);
      if (idx >= 0) {
        state.items[idx] = {
          ...state.items[idx],
          price: action.payload.price,
          lastUpdated: action.payload.ts,
        };
      }
    },
  },
});

export const {
  setItems,
  setLoading,
  setError,
  setCategory,
  setSort,
  updatePrice,
} = tableSlice.actions;
export default tableSlice.reducer;
