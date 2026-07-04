import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageTransition } from './PageTransition';

// Regression guard for the "blank page on client-side navigation" bug: the
// page-transition wrapper must always render its children into the DOM (never
// swallow the routed content).
describe('PageTransition', () => {
  it('renders its children', () => {
    render(
      <PageTransition>
        <p>Shopping Cart</p>
      </PageTransition>,
    );
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });

  it('remounts and re-renders content when keyed by a new route', () => {
    const { rerender } = render(
      <PageTransition key="/cart">
        <p>Cart Page</p>
      </PageTransition>,
    );
    expect(screen.getByText('Cart Page')).toBeInTheDocument();

    rerender(
      <PageTransition key="/wishlist">
        <p>Wishlist Page</p>
      </PageTransition>,
    );
    expect(screen.getByText('Wishlist Page')).toBeInTheDocument();
  });
});
