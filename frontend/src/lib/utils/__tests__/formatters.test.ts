import { describe, it, expect } from 'vitest';
import { formatPrice } from '../formatters';

describe('formatPrice', () => {
  it('should format a price in USD by default', () => {
    const result = formatPrice(100000);
    expect(result).toBe('$100,000');
  });

  it('should format a price without decimals', () => {
    const result = formatPrice(250000);
    expect(result).toBe('$250,000');
  });

  it('should handle large prices correctly', () => {
    const result = formatPrice(1500000);
    expect(result).toBe('$1,500,000');
  });

  it('should handle small prices', () => {
    const result = formatPrice(50);
    expect(result).toBe('$50');
  });

  it('should format with different currencies', () => {
    const result = formatPrice(100000, 'EUR');
    expect(result).toBe('€100,000');
  });

  it('should format with different locales', () => {
    const result = formatPrice(100000, 'USD', 'es-ES');
    expect(result).toContain('100');
    expect(result).toContain('000');
  });

  it('should handle zero correctly', () => {
    const result = formatPrice(0);
    expect(result).toBe('$0');
  });

  it('should format decimal numbers without showing decimals', () => {
    const result = formatPrice(100000.99);
    expect(result).toBe('$100,001');
  });
});

