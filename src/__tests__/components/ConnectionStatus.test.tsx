import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/test-utils';
import ConnectionStatus from '../../components/ConnectionStatus';

describe('ConnectionStatus component', () => {
  it('renders disconnected status when not connected', () => {
    renderWithProviders(<ConnectionStatus />, {
      preloadedState: {
        connection: { isConnected: false },
      },
    });
    
    // Check if the disconnected message is rendered
    const statusMessage = screen.getByText('Waiting for UE5 game connection...');
    expect(statusMessage).toBeInTheDocument();
    
    // Check if it has the disconnected class
    const statusElement = statusMessage.closest('.connection-status');
    expect(statusElement).toHaveClass('disconnected');
    expect(statusElement).not.toHaveClass('connected');
  });

  it('renders connected status when connected', () => {
    renderWithProviders(<ConnectionStatus />, {
      preloadedState: {
        connection: { isConnected: true },
      },
    });
    
    // Check if the connected message is rendered
    const statusMessage = screen.getByText('Connected to UE5 game');
    expect(statusMessage).toBeInTheDocument();
    
    // Check if it has the connected class
    const statusElement = statusMessage.closest('.connection-status');
    expect(statusElement).toHaveClass('connected');
    expect(statusElement).not.toHaveClass('disconnected');
  });
});