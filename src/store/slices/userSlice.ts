
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  categories: string[];
  language: string;
  notifications: boolean;
}

interface UserState {
  preferences: UserPreferences;
  isAuthenticated: boolean;
  profile: {
    name: string;
    email: string;
    avatar: string;
  } | null;
}

const initialState: UserState = {
  preferences: {
    categories: ['technology', 'entertainment', 'sports'],
    language: 'en',
    notifications: true,
  },
  isAuthenticated: false,
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setProfile: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload;
    },
  },
});

export const { updatePreferences, setAuthenticated, setProfile } = userSlice.actions;
export default userSlice.reducer;
