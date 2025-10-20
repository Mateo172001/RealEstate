import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropertyFilters } from '../PropertyFilters';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('PropertyFilters', () => {
  it('should render the filters button', () => {
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('should show the default filters when rendering', () => {
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    expect(screen.getByLabelText('Property Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
  });

  it('should call onFilterChange when typing in the name input', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    const nameInput = screen.getByLabelText('Property Name');
    await user.type(nameInput, 'Villa');

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalled();
    });
  });

  it('should call onFilterChange when typing in the address input', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    const addressInput = screen.getByLabelText('Location');
    await user.type(addressInput, 'Miami');

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalled();
    });
  });

  it('should call onFilterChange when submitting the form', () => {
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    const form = screen.getByRole('button', { name: /Search Now/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    expect(onFilterChange).toHaveBeenCalled();
  });

  it('should prevent the default behavior of the form', () => {
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    const form = screen.getByRole('button', { name: /Search Now/i }).closest('form');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(submitEvent, 'preventDefault');

    if (form) {
      form.dispatchEvent(submitEvent);
    }

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should update the internal filters when the user types', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    const nameInput = screen.getByLabelText('Property Name') as HTMLInputElement;
    await user.type(nameInput, 'Modern Villa');

    expect(nameInput.value).toBe('Modern Villa');
  });

  it('should render the search button', () => {
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    const searchButton = screen.getByRole('button', { name: /Search Now/i });
    expect(searchButton).toBeInTheDocument();
  });

  it('should disable the search button when isSearching is true', () => {
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} isSearching={true} />);

    const searchButton = screen.getByRole('button', { name: /Searching.../i });
    expect(searchButton).toBeDisabled();
  });

  it('should show "Searching..." text when isSearching is true', () => {
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} isSearching={true} />);

    expect(screen.getByRole('button', { name: /Searching.../i })).toBeInTheDocument();
    expect(screen.getByText('Searching properties...')).toBeInTheDocument();
  });

  it('should show the formatted price range correctly', () => {
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    expect(screen.getByText('$0 - $2,000,000')).toBeInTheDocument();
  });

  it('should have appropriate placeholders in the inputs', () => {
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    const nameInput = screen.getByPlaceholderText('e.g. Modern Villa');
    const addressInput = screen.getByPlaceholderText('e.g. New York');

    expect(nameInput).toBeInTheDocument();
    expect(addressInput).toBeInTheDocument();
  });

  it('should allow multiple filter changes', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    const nameInput = screen.getByLabelText('Property Name');
    const addressInput = screen.getByLabelText('Location');

    await user.type(nameInput, 'Villa');
    await user.type(addressInput, 'Beach');

    await waitFor(() => {
      expect(onFilterChange).toHaveBeenCalledTimes(10);
    });
  });

  it('should call onFilterChange with the correct filters when submitting', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<PropertyFilters onFilterChange={onFilterChange} />);

    const nameInput = screen.getByLabelText('Property Name');
    await user.type(nameInput, 'Test');

    const form = screen.getByRole('button', { name: /Search Now/i }).closest('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      const lastCall = onFilterChange.mock.calls[onFilterChange.mock.calls.length - 1];
      expect(lastCall[0]).toMatchObject({
        name: 'Test',
        address: '',
        minPrice: 0,
        maxPrice: 2000000,
      });
    });
  });
});

