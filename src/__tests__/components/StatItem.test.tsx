import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatItem from '../../components/StatItem';

describe('StatItem component', () => {
  it('renders with string value', () => {
    const label = 'Test Label';
    const value = 'Test Value';
    
    render(<StatItem label={label} value={value} />);
    
    // Check if the label is rendered
    const labelElement = screen.getByText(`${label}:`);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveClass('stat-label');
    
    // Check if the value is rendered
    const valueElement = screen.getByText(value);
    expect(valueElement).toBeInTheDocument();
    expect(valueElement).toHaveClass('stat-value');
    
    // Check if they're inside a div with the correct class
    const containerElement = labelElement.closest('.stat-item');
    expect(containerElement).toBeInTheDocument();
  });

  it('renders with number value', () => {
    const label = 'Health';
    const value = 100;
    
    render(<StatItem label={label} value={value} />);
    
    // Check if the label is rendered
    const labelElement = screen.getByText(`${label}:`);
    expect(labelElement).toBeInTheDocument();
    
    // Check if the value is rendered
    const valueElement = screen.getByText(value.toString());
    expect(valueElement).toBeInTheDocument();
  });
});