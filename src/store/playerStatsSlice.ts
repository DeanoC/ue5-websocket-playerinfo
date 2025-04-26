import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PlayerStats {
  health: number;
  mana: number;
  stamina: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  level: number;
  experience: number;
  [key: string]: any; // Allow for additional properties
}

const initialState: PlayerStats = {
  health: 100,
  mana: 100,
  stamina: 100,
  position: { x: 0, y: 0, z: 0 },
  level: 1,
  experience: 0,
};

export const playerStatsSlice = createSlice({
  name: 'playerStats',
  initialState,
  reducers: {
    updatePlayerStats: (state, action: PayloadAction<PlayerStats>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updatePlayerStats } = playerStatsSlice.actions;
export default playerStatsSlice.reducer;