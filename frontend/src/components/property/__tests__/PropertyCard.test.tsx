import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from '../PropertyCard';
import { Property } from '@/types/property';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('PropertyCard', () => {
  const mockProperty: Property = {
    id: '1',
    idOwner: 'owner1',
    name: 'Modern Villa',
    address: '123 Beach Avenue, Miami, FL',
    price: 450000,
    imageUrl: 'https://example.com/villa.jpg',
  };

  it('should render the property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Modern Villa')).toBeInTheDocument();
    expect(screen.getByText('123 Beach Avenue, Miami, FL')).toBeInTheDocument();
    expect(screen.getByText('$450,000')).toBeInTheDocument();
  });

  it('should render the image with the correct src and alt', () => {
    render(<PropertyCard property={mockProperty} />);

    const image = screen.getByAltText('Modern Villa');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/villa.jpg');
  });

  it('should render a link to the property detail page', () => {
    render(<PropertyCard property={mockProperty} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/properties/1');
  });

  it('should show the "For Sale" badge', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('For Sale')).toBeInTheDocument();
  });

  it('should render the favorite button', () => {
    render(<PropertyCard property={mockProperty} />);

    const favoriteButton = screen.getByRole('button');
    expect(favoriteButton).toBeInTheDocument();
  });

  it('should prevent navigation when clicking the favorite button', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    render(<PropertyCard property={mockProperty} />);

    const favoriteButton = screen.getByRole('button');
    fireEvent.click(favoriteButton);

    expect(consoleSpy).toHaveBeenCalledWith('Favorited:', '1');
    consoleSpy.mockRestore();
  });

  it('should format the price correctly in different values', () => {
    const { rerender } = render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('$450,000')).toBeInTheDocument();

    const expensiveProperty = { ...mockProperty, price: 1500000 };
    rerender(<PropertyCard property={expensiveProperty} />);
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();

    const affordableProperty = { ...mockProperty, price: 75000 };
    rerender(<PropertyCard property={affordableProperty} />);
    expect(screen.getByText('$75,000')).toBeInTheDocument();
  });

  it('should truncate long names correctly', () => {
    const longNameProperty = {
      ...mockProperty,
      name: 'This is an extremely long property name that should be truncated',
    };

    render(<PropertyCard property={longNameProperty} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveClass('line-clamp-1');
  });

  it('should truncate long addresses correctly', () => {
    const longAddressProperty = {
      ...mockProperty,
      address:
        'This is an extremely long address with many details that should be truncated to two lines maximum',
    };

    render(<PropertyCard property={longAddressProperty} />);

    const address = screen.getByText(/This is an extremely long address/);
    expect(address).toHaveClass('line-clamp-2');
  });
});

