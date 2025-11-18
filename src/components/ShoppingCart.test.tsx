// src/components/ShoppingCart.test.tsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShoppingCart } from './ShoppingCart';

// helper: updates number input in one shot, avoids "1" → "13" issue
const setNumberInput = (el: HTMLInputElement, value: number | string) => {
  const v = String(value);
  // Some components listen to 'input', others to 'change'—send both, then blur to commit
  fireEvent.input(el, { target: { value: v } });
  fireEvent.change(el, { target: { value: v } });
  fireEvent.blur(el);
};

const add = async (name: string, price: string) => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/product name/i), name);
  await user.type(screen.getByLabelText(/product price/i), price);
  await user.click(screen.getByRole('button', { name: /add to cart/i }));
};

let nextId = 1700000000000;
beforeEach(() => {
  // unique ids for each added item (avoid duplicate key warning)
  vi.spyOn(Date, 'now').mockImplementation(() => ++nextId);
});

describe('ShoppingCart', () => {
  it('shows empty state', () => {
    render(<ShoppingCart />);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('adds an item and shows totals', async () => {
    render(<ShoppingCart />);
    await add('Notebook', '12.5');

    expect(screen.getByText('Notebook')).toBeInTheDocument();
    expect(screen.getByText('$12.50')).toBeInTheDocument();

    expect(screen.getByText(/subtotal:/i)).toHaveTextContent('$12.50');
    expect(screen.getByText(/tax:/i)).toHaveTextContent('$1.00');
    // use ^Total: to avoid matching Subtotal:
    expect(screen.getByText(/^Total:/i)).toHaveTextContent('$13.50');
  });

  it('updates quantity and recalculates', async () => {
    render(<ShoppingCart />);
    await add('Mouse', '20');

    const qty = screen.getByRole('spinbutton', { name: /quantity for mouse/i }) as HTMLInputElement;

    // Replace value in one shot; component likely clamps onChange, so avoid intermediate ""
    setNumberInput(qty, 3);

    await waitFor(() => expect(qty).toHaveValue(3));
    await waitFor(() => expect(screen.getByText(/subtotal:/i)).toHaveTextContent('$60.00'));
    await waitFor(() => expect(screen.getByText(/^Total:/i)).toHaveTextContent('$61.56'));
  });

  it('removes and clears', async () => {
    render(<ShoppingCart />);
    await add('A', '30');
    await add('B', '25');

    const rm = screen.getAllByRole('button', { name: /remove/i });
    await userEvent.click(rm[0]); // remove A
    expect(screen.queryByText('A')).not.toBeInTheDocument();

    // Clear the remaining B
    await userEvent.click(screen.getByRole('button', { name: /clear cart/i }));
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });
});
