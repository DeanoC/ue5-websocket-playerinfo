import { describe, it, expect } from 'vitest';
import { screen, act } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import App from '../../App';
import { setConnectionStatus } from '../../store/connectionSlice';
import { updatePlayerStats } from '../../store/playerStatsSlice';

describe('Redux and React integration', () => {
  it('updates UI when connection status changes', () => {
    const { store } = renderWithProviders(<App />);

    // Initially, the connection status should be disconnected
    expect(screen.getByText('Waiting for UE5 game connection...')).toBeInTheDocument();

    // Dispatch an action to change the connection status
    act(() => {
      store.dispatch(setConnectionStatus(true));
    });

    // The UI should update to show connected status
    expect(screen.getByText('Connected to UE5 game')).toBeInTheDocument();

    // Dispatch an action to change the connection status back
    act(() => {
      store.dispatch(setConnectionStatus(false));
    });

    // The UI should update to show disconnected status again
    expect(screen.getByText('Waiting for UE5 game connection...')).toBeInTheDocument();
  });

  it('updates UI when player stats change', () => {
    const { store } = renderWithProviders(<App />);

    // Initially, the player stats should have default values
    const healthLabel = screen.getByText('Health:');
    expect(healthLabel).toBeInTheDocument();
    // Find the health value by looking at the next sibling of the health label's parent
    const healthItem = healthLabel.closest('.stat-item');
    const healthValue = healthItem?.querySelector('.stat-value');
    expect(healthValue).toHaveTextContent('100');

    // Dispatch an action to update player stats
    act(() => {
      store.dispatch(updatePlayerStats({
        health: 75,
        mana: 80,
        stamina: 100,
        position: { x: 0, y: 0, z: 0 },
        level: 1,
        experience: 0,
        customStat: 'Custom Value',
      }));
    });

    // The UI should update to show the new values
    const updatedHealthLabel = screen.getByText('Health:');
    expect(updatedHealthLabel).toBeInTheDocument();
    const updatedHealthItem = updatedHealthLabel.closest('.stat-item');
    const updatedHealthValue = updatedHealthItem?.querySelector('.stat-value');
    expect(updatedHealthValue).toHaveTextContent('75');

    const manaLabel = screen.getByText('Mana:');
    expect(manaLabel).toBeInTheDocument();
    const manaItem = manaLabel.closest('.stat-item');
    const manaValue = manaItem?.querySelector('.stat-value');
    expect(manaValue).toHaveTextContent('80');

    // Custom stat should be added
    expect(screen.getByText('CustomStat:')).toBeInTheDocument();
    expect(screen.getByText('Custom Value')).toBeInTheDocument();
  });
});
