import { describe, it, expect } from 'vitest';
import connectionReducer, { setConnectionStatus } from '../../store/connectionSlice';

describe('connectionSlice reducer', () => {
  it('should return the initial state', () => {
    expect(connectionReducer(undefined, { type: undefined })).toEqual({
      isConnected: false,
    });
  });

  it('should handle setConnectionStatus', () => {
    const previousState = { isConnected: false };
    
    // Test setting to true
    expect(
      connectionReducer(previousState, setConnectionStatus(true))
    ).toEqual({
      isConnected: true,
    });
    
    // Test setting to false
    expect(
      connectionReducer({ isConnected: true }, setConnectionStatus(false))
    ).toEqual({
      isConnected: false,
    });
  });
});