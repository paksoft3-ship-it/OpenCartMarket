"use client";

import { Product } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    product: Product;
}

export default function AddToCartButton({ product, children, ...props }: AddToCartButtonProps) {
    const addToCart = useAppStore(state => state.addToCart);
    const router = useRouter();

    const handleAdd = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
        router.push('/checkout');
    };

    return (
        <button onClick={handleAdd} {...props}>
            {children}
        </button>
    );
}
