import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  modalOpen: boolean;
  selectedPair: string | null;
}

const initialState: UIState = {
  modalOpen: false,
  selectedPair: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<string | null>) {
      state.modalOpen = true;
      state.selectedPair = action.payload;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.selectedPair = null;
    },
  },
});

export const { openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
