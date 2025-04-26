import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import App from '../../App';
import { setConnectionStatus } from '../../store/connectionSlice';
import { updatePlayerStats } from '../../store/playerStatsSlice';

// Mock the electron IPC renderer
const mockIpcRenderer = {
  send: vi.fn(),
  on: vi.fn(),
};

// Mock the window.electron object
Object.defineProperty(window, 'electron', {
  value: {
    ipcRenderer: mockIpcRenderer,
  },
  writable: true,
});

describe('End-to-end application flow', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Setup the IPC renderer mock to simulate receiving messages
    mockIpcRenderer.on.mockImplementation((channel, callback) => {
      if (channel === 'connection-status-update') {
        // Store the callback to trigger it later
        window.connectionStatusCallback = callback;
      } else if (channel === 'player-stats-update') {
        // Store the callback to trigger it later
        window.playerStatsCallback = callback;
      }
    });
  });

  it('handles the full application flow with IPC communication', async () => {
    const { store } = renderWithProviders(<App />);

    // Initially, the connection status should be disconnected
    expect(screen.getByText('Waiting for UE5 game connection...')).toBeInTheDocument();

    // Simulate receiving a connection status update from the main process
    act(() => {
      store.dispatch(setConnectionStatus(true));
    });

    // The UI should update to show connected status
    await waitFor(() => {
      expect(screen.getByText('Connected to UE5 game')).toBeInTheDocument();
    });

    // Simulate receiving player stats from the main process
    act(() => {
      store.dispatch(updatePlayerStats({
        health: 60,
        mana: 75,
        stamina: 90,
        position: { x: 15.5, y: 25.5, z: 35.5 },
        level: 3,
        experience: 250,
        strength: 40,
      }));
    });

    // The UI should update to show the new player stats
    await waitFor(() => {
      expect(screen.getByText('Health:')).toBeInTheDocument();
      expect(screen.getByText('60')).toBeInTheDocument();

      expect(screen.getByText('Mana:')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();

      expect(screen.getByText('Level:')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();

      expect(screen.getByText('Strength:')).toBeInTheDocument();
      expect(screen.getByText('40')).toBeInTheDocument();
    });

    // Simulate disconnection
    act(() => {
      store.dispatch(setConnectionStatus(false));
    });

    // The UI should update to show disconnected status
    await waitFor(() => {
      expect(screen.getByText('Waiting for UE5 game connection...')).toBeInTheDocument();
    });
  });
});

// Add to global Window interface for TypeScript
declare global {
  interface Window {
    connectionStatusCallback?: (isConnected: boolean) => void;
    playerStatsCallback?: (stats: any) => void;
  }
}
