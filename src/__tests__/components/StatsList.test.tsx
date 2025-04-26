import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import StatsList from '../../components/StatsList';
import { PlayerStats } from '../../store/playerStatsSlice';

describe('StatsList component', () => {
  it('renders standard stats correctly', () => {
    const mockPlayerStats: PlayerStats = {
      health: 80,
      mana: 90,
      stamina: 70,
      position: { x: 10.123, y: 20.456, z: 30.789 },
      level: 2,
      experience: 150,
    };

    renderWithProviders(<StatsList />, {
      preloadedState: {
        playerStats: mockPlayerStats,
      },
    });

    // Check if standard stats are rendered
    expect(screen.getByText('Health:')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();

    expect(screen.getByText('Mana:')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();

    expect(screen.getByText('Stamina:')).toBeInTheDocument();
    expect(screen.getByText('70')).toBeInTheDocument();

    expect(screen.getByText('Level:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('Experience:')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();

    // Check if position is formatted correctly
    expect(screen.getByText('Position:')).toBeInTheDocument();
    expect(screen.getByText('X: 10.12, Y: 20.46, Z: 30.79')).toBeInTheDocument();
  });

  it('renders custom stats correctly', () => {
    const mockPlayerStats: PlayerStats = {
      health: 100,
      mana: 100,
      stamina: 100,
      position: { x: 0, y: 0, z: 0 },
      level: 1,
      experience: 0,
      // Custom stats
      strength: 25,
      agility: 18,
      intelligence: 30,
      customObject: { prop1: 'value1', prop2: 'value2' },
    };

    renderWithProviders(<StatsList />, {
      preloadedState: {
        playerStats: mockPlayerStats,
      },
    });

    // Check if custom stats are rendered
    expect(screen.getByText('Strength:')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();

    expect(screen.getByText('Agility:')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();

    expect(screen.getByText('Intelligence:')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();

    // Check if object is stringified
    expect(screen.getByText('CustomObject:')).toBeInTheDocument();
    expect(screen.getByText('{"prop1":"value1","prop2":"value2"}')).toBeInTheDocument();
  });
});
