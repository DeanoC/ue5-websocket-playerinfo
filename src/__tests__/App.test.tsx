import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from './utils/test-utils';
import App from '../App';

describe('App component', () => {
  it('renders the app with all main components', () => {
    renderWithProviders(<App />);
    
    // Check if the header is rendered
    const headerTitle = screen.getByText('UE5 Player Stats Monitor');
    expect(headerTitle).toBeInTheDocument();
    
    // Check if the main title is rendered
    const mainTitle = screen.getByText('Real-time Player Statistics');
    expect(mainTitle).toBeInTheDocument();
    expect(mainTitle.tagName).toBe('H2');
    
    // Check if the PlayerStatsDisplay component is rendered
    const statsTitle = screen.getByText('Current Player Stats:');
    expect(statsTitle).toBeInTheDocument();
    
    // Check if the connection status is rendered
    const connectionStatus = screen.getByText('Waiting for UE5 game connection...');
    expect(connectionStatus).toBeInTheDocument();
    
    // Check if the footer is rendered
    const footerText = screen.getByText('Connect your UE5 game to WebSocket server at ws://localhost:8080');
    expect(footerText).toBeInTheDocument();
  });
});