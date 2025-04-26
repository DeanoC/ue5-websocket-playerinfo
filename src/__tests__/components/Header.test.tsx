import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../../components/Header';

describe('Header component', () => {
  it('renders the header with correct title', () => {
    render(<Header />);
    
    // Check if the header title is rendered
    const headerTitle = screen.getByText('UE5 Player Stats Monitor');
    expect(headerTitle).toBeInTheDocument();
    
    // Check if it's inside a header element with the correct class
    const headerElement = headerTitle.closest('header');
    expect(headerElement).toHaveClass('logo');
  });
});