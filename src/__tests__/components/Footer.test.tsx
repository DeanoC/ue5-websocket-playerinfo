import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer component', () => {
  it('renders the footer with connection instructions', () => {
    render(<Footer />);
    
    // Check if the connection instructions are rendered
    const connectionInstructions = screen.getByText('Connect your UE5 game to WebSocket server at ws://localhost:8080');
    expect(connectionInstructions).toBeInTheDocument();
    
    // Check if it's inside a footer element
    const footerElement = connectionInstructions.closest('footer');
    expect(footerElement).toBeInTheDocument();
  });
});