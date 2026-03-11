export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
}

export interface Developer {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
    products: number;
    joined: string;
    description: string;
}

export interface Product {
    id: string;
    slug: string;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    rating: string;
    installs: number;
    categoryId: string;
    developerId: string;
    compatibility: string[];
    images: string[];
    features: string[];
    tags: string[];
    license?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Review {
    id: string;
    productId: string;
    rating: number;
    author: string;
    date: string;
    content: string;
}

export interface Order {
    id: string;
    date: string;
    total: number;
    status: 'completed' | 'pending' | 'failed';
    items: {
        productId: string;
        productName: string;
        price: number;
    }[];
}

export interface License {
    id: string;
    productId: string;
    productName: string;
    key: string;
    domain: string | null;
    status: 'active' | 'inactive';
    expiresAt: string | null;
}
