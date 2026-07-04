import { create } from 'zustand';

/**
 * Lightweight placeholder store so the Header can render a live cart/wishlist
 * badge before the `features/cart` and `features/wishlist` domains exist.
 * Later stages should sync this from the real cart query response (e.g. in
 * a `useEffect` on the `/cart` query) rather than managing cart state here.
 */
interface CartCountState {
  cartCount: number;
  wishlistCount: number;
  setCartCount: (count: number) => void;
  setWishlistCount: (count: number) => void;
}

export const useCartCountStore = create<CartCountState>()((set) => ({
  cartCount: 0,
  wishlistCount: 0,
  setCartCount: (cartCount) => set({ cartCount }),
  setWishlistCount: (wishlistCount) => set({ wishlistCount }),
}));
