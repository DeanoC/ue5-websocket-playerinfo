import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import PlayerStatsDisplay from '../../components/PlayerStatsDisplay';

describe('PlayerStatsDisplay component', () => {
  it('renders the player stats display with title and child components', () => {
    renderWithProviders(<PlayerStatsDisplay />);
    
    // Check if the title is rendered
    const title = screen.getByText('Current Player Stats:');
    expect(title).toBeInTheDocument();
    
    // Check if the component has the correct structure
    const sectionElement = title.closest('section');
    expect(sectionElement).toHaveClass('player-stats');
    
    // Check if the connection status component is rendered
    // We don't need to test its functionality here as it's tested in its own test file
    const connectionStatusElement = screen.getByText('Waiting for UE5 game connection...');
    expect(connectionStatusElement).toBeInTheDocument();
    
    // We don't need to test StatsList functionality here as it's tested in its own test file
    // But we can check that the container for it exists
    const statsInfoElement = title.closest('.player-stats-info');
    expect(statsInfoElement).toBeInTheDocument();
  });
});