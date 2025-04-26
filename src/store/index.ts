import { configureStore } from '@reduxjs/toolkit';
import connectionReducer from './connectionSlice';
import playerStatsReducer from './playerStatsSlice';
import ipcMiddleware from '../utils/ipcMiddleware';

export const store = configureStore({
  reducer: {
    connection: connectionReducer,
    playerStats: playerStatsReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(ipcMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;