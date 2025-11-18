import { describe, it, expect } from 'vitest';
import {
  type CartItem, calculateItemTotal, calculateSubtotal, calculateDiscount,
  calculateTax, calculateTotal, formatCurrency, isValidQuantity
} from './cartUtils';

describe('cartUtils', () => {
  it('item total = price * qty', () => {
    const item: CartItem = { id: 1, name: 'Pen', price: 2.5, quantity: 4 };
    expect(calculateItemTotal(item)).toBeCloseTo(10);
  });

  it('subtotal sums items', () => {
    const items: CartItem[] = [
      { id: 1, name: 'A', price: 10, quantity: 2 },
      { id: 2, name: 'B', price: 5, quantity: 3 },
    ];
    expect(calculateSubtotal(items)).toBe(35);
  });

  it('discount tiers', () => {
    expect(calculateDiscount(49.99)).toBeCloseTo(0);
    expect(calculateDiscount(50)).toBeCloseTo(2.5);
    expect(calculateDiscount(100)).toBeCloseTo(10);
  });

  it('tax is 8%', () => {
    expect(calculateTax(100)).toBeCloseTo(8);
  });

  it('total adds up and rounds', () => {
    const items: CartItem[] = [{ id: 1, name: 'X', price: 10, quantity: 3 }];
    expect(calculateTotal(items)).toBeCloseTo(32.4);
  });

  it('formatCurrency', () => {
    expect(formatCurrency(5.5)).toBe('$5.50');
  });

  it('isValidQuantity', () => {
    expect(isValidQuantity(1)).toBe(true);
    expect(isValidQuantity(0)).toBe(false);
  });
});
