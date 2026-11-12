import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import api from '../../api';
import { OrdersPage } from './OrdersPage';

vi.mock('../../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const productId = 'product-123';

const orders = [
  {
    id: 'order-123',
    orderTimeMs: 1780000000000,
    totalCostCents: 1099,
    products: [
      {
        product: {
          id: productId,
          image: 'images/products/example.png',
          name: 'Example Product',
        },
        quantity: 2,
        estimatedDeliveryTimeMs: 1780100000000,
      },
    ],
  },
];

describe('OrdersPage add-to-cart action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockResolvedValue({ data: orders });
    api.post.mockResolvedValue({ data: {} });
  });

  it('adds an ordered product to the cart and refreshes the cart', async () => {
    const user = userEvent.setup();
    const loadCart = vi.fn().mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <OrdersPage cart={[]} loadCart={loadCart} />
      </MemoryRouter>
    );

    const addButton = await screen.findByRole('button', { name: /add to cart/i });
    await user.click(addButton);

    expect(api.post).toHaveBeenCalledWith('/api/cart-items', {
      productId,
      quantity: 1,
    });

    await waitFor(() => expect(loadCart).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole('status')).toHaveTextContent('Added to cart.');
  });

  it('shows an error when the cart API rejects the request', async () => {
    const user = userEvent.setup();
    const loadCart = vi.fn().mockResolvedValue(undefined);
    api.post.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <OrdersPage cart={[]} loadCart={loadCart} />
      </MemoryRouter>
    );

    await user.click(await screen.findByRole('button', { name: /add to cart/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Could not add this product. Please try again.'
    );
    expect(loadCart).not.toHaveBeenCalled();
  });
});
