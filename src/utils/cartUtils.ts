// This file contains functions to help calculate cart totals

// type for items
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// total for one item
export function calculateItemTotal(item: CartItem): number {
  return item.price * item.quantity;
}

//  subtotal for all items
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

//  discount rules
export function calculateDiscount(subtotal: number): number {
  if (subtotal >= 100) return subtotal * 0.1; // 10% off
  if (subtotal >= 50) return subtotal * 0.05; // 5% off
  return 0;
}

//  tax = 8%
export function calculateTax(amount: number): number {
  return amount * 0.08;
}

//  total after discount + tax
export function calculateTotal(items: CartItem[]): number {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal);
  const after = subtotal - discount;
  const tax = calculateTax(after);
  return Number((after + tax).toFixed(2)); // round to 2 decimals
}

//  format price like $5.00
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

//  check valid quantity
export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity > 0;
}
