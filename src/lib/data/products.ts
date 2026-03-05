import { Product } from '../types';
import { readJsonFile } from './utils';

export async function getProducts(): Promise<Product[]> {
    return readJsonFile<Product[]>('products.json');
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const products = await getProducts();
    return products.find(p => p.slug === slug) || null;
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
    const products = await getProducts();
    return products.filter(p => p.categoryId === categoryId);
}

export async function getProductsByDeveloper(developerId: string): Promise<Product[]> {
    const products = await getProducts();
    return products.filter(p => p.developerId === developerId);
}

export async function searchProducts(query: string, category?: string, minPrice?: number, maxPrice?: number, sort?: string): Promise<Product[]> {
    let products = await getProducts();

    if (query) {
        const lowerQuery = query.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery)
        );
    }

    if (category && category !== 'all') {
        products = products.filter(p => p.categoryId === category);
    }

    if (minPrice !== undefined) {
        products = products.filter(p => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
        products = products.filter(p => p.price <= maxPrice);
    }

    if (sort) {
        switch (sort) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                products.sort((a, b) => b.installs - a.installs);
                break;
            case 'newest':
                products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                break;
            case 'rating':
                products.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
                break;
        }
    }

    return products;
}
