import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

export interface CartItem {
    product: Product;
    quantity: number;
}

export type UserRole = 'customer' | 'admin' | null;

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AppState {
    cart: CartItem[];
    user: User | null;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    login: (user: User) => void;
    logout: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            cart: [],
            user: null,
            addToCart: (product) =>
                set((state) => {
                    const exists = state.cart.find((item) => item.product.id === product.id);
                    if (exists) return state; // Only 1 qty per digital product usually
                    return { cart: [...state.cart, { product, quantity: 1 }] };
                }),
            removeFromCart: (productId) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.product.id !== productId),
                })),
            clearCart: () => set({ cart: [] }),
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'marketplace-storage',
        }
    )
);
