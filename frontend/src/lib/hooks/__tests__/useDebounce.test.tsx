import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce the value after the specified delay', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 100 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 100 });

    expect(result.current).toBe('initial');

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 200 }
    );
  });

  it('should cancel the previous timeout if the value changes before the delay', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'first' });
    
    await new Promise((resolve) => setTimeout(resolve, 50));

    rerender({ value: 'second' });

    await waitFor(
      () => {
        expect(result.current).toBe('second');
      },
      { timeout: 200 }
    );
  });

  it('should work with different data types', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 123 } }
    );

    expect(result.current).toBe(123);

    rerender({ value: 456 });

    await waitFor(
      () => {
        expect(result.current).toBe(456);
      },
      { timeout: 200 }
    );
  });

  it('should use the default delay of 500ms if not specified', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    
    expect(result.current).toBe('initial');

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 600 }
    );
  });
});

