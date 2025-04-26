import { describe, it, expect } from 'vitest';
import playerStatsReducer, { updatePlayerStats, PlayerStats } from '../../store/playerStatsSlice';

describe('playerStatsSlice reducer', () => {
  it('should return the initial state', () => {
    expect(playerStatsReducer(undefined, { type: undefined })).toEqual({
      health: 100,
      mana: 100,
      stamina: 100,
      position: { x: 0, y: 0, z: 0 },
      level: 1,
      experience: 0,
    });
  });

  it('should handle updatePlayerStats with complete update', () => {
    const newStats: PlayerStats = {
      health: 80,
      mana: 90,
      stamina: 70,
      position: { x: 10, y: 20, z: 30 },
      level: 2,
      experience: 150,
    };

    expect(
      playerStatsReducer(undefined, updatePlayerStats(newStats))
    ).toEqual(newStats);
  });

  it('should handle updatePlayerStats with partial update', () => {
    const initialState: PlayerStats = {
      health: 100,
      mana: 100,
      stamina: 100,
      position: { x: 0, y: 0, z: 0 },
      level: 1,
      experience: 0,
    };

    const partialUpdate = {
      health: 80,
      mana: 90,
    };

    expect(
      playerStatsReducer(initialState, updatePlayerStats(partialUpdate as PlayerStats))
    ).toEqual({
      ...initialState,
      ...partialUpdate,
    });
  });

  it('should handle updatePlayerStats with custom properties', () => {
    const initialState: PlayerStats = {
      health: 100,
      mana: 100,
      stamina: 100,
      position: { x: 0, y: 0, z: 0 },
      level: 1,
      experience: 0,
    };

    const updateWithCustomProps = {
      health: 80,
      mana: 100,
      stamina: 100,
      position: { x: 0, y: 0, z: 0 },
      level: 1,
      experience: 0,
      customStat1: 'value1',
      customStat2: 42,
    };

    expect(
      playerStatsReducer(initialState, updatePlayerStats(updateWithCustomProps as PlayerStats))
    ).toEqual({
      ...initialState,
      ...updateWithCustomProps,
    });
  });
});
