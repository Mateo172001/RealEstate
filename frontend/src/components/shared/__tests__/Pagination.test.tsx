import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('should not render anything if there is only one page', () => {
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render all page numbers if totalPages <= 7', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should call onPageChange when clicking on a page number', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    const page3 = screen.getByText('3');
    fireEvent.click(page3);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('should disable the Previous button on the first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    const previousButton = screen.getByRole('link', { name: /previous/i });
    expect(previousButton).toHaveClass('pointer-events-none');
    expect(previousButton).toHaveClass('opacity-50');
  });

  it('should disable the Next button on the last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('link', { name: /next/i });
    expect(nextButton).toHaveClass('pointer-events-none');
    expect(nextButton).toHaveClass('opacity-50');
  });

  it('should navigate to the previous page when clicking on Previous', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    const previousButton = screen.getByRole('link', { name: /previous/i });
    fireEvent.click(previousButton);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('should navigate to the next page when clicking on Next', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('link', { name: /next/i });
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('should not change page if Previous is clicked on the first page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

    const previousButton = screen.getByRole('link', { name: /previous/i });
    fireEvent.click(previousButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('should not change page if Next is clicked on the last page', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole('link', { name: /next/i });
    fireEvent.click(nextButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('should show ellipsis when there are many pages', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={1} totalPages={10} onPageChange={onPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should show the current page as active', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

    const currentPageLink = screen.getByRole('link', { name: '3' });
    expect(currentPageLink).toBeInTheDocument();
  });

  it('should generate page numbers correctly with ellipsis on both sides', () => {
    const onPageChange = vi.fn();
    render(<Pagination currentPage={5} totalPages={10} onPageChange={onPageChange} />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});

