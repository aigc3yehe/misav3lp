import { configureStore } from '@reduxjs/toolkit';
import agentReducer from './slices/agentSlice';
import toastReducer from './slices/toastSlice';
import walletReducer from './slices/walletSlice';


export const store = configureStore({
  reducer: {
    agent: agentReducer,
    toast: toastReducer,
    wallet: walletReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
