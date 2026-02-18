import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertiesReducer from './slices/propertiesSlice';
import drockSearchReducer from './slices/drockSearchSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    drockSearch: drockSearchReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

