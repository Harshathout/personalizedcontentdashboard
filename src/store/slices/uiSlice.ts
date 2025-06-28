
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  darkMode: boolean;
  sidebarOpen: boolean;
  activeTab: 'feed' | 'trending' | 'favorites';
}

const initialState: UIState = {
  darkMode: false,
  sidebarOpen: true,
  activeTab: 'feed',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveTab: (state, action: PayloadAction<UIState['activeTab']>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { toggleDarkMode, toggleSidebar, setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
