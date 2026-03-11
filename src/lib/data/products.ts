import productsFallback from "@/data/products.json";
import { fileRepository } from "@/lib/server/db/fileRepository";
import { Product } from "../types";
import { AdminProduct } from "@/lib/server/db/types";
import { readJsonFile } from "./utils";

function mapAdminProductToCatalog(admin: AdminProduct): Product {
    const fallback = (productsFallback as Product[]).find((item) => item.slug === admin.slug || item.id === admin.id);
    return {
        id: admin.id,
        slug: admin.slug,
        name: admin.name,
        shortDescription: admin.shortDescription,
        description: admin.description,
        price: admin.price,
        rating: fallback?.rating ?? "4.8",
        installs: fallback?.installs ?? 0,
        categoryId: admin.categoryId,
        developerId: admin.developerId,
        compatibility: admin.compatibility,
        images: admin.images.length > 0 ? admin.images : (fallback?.images ?? []),
        features: admin.features,
        tags: admin.tags,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
    };
}

export async function getProducts(): Promise<Product[]> {
    try {
        const adminProducts = await fileRepository.listProducts();
        if (adminProducts.length === 0) {
            return readJsonFile<Product[]>("products.json");
        }
        return adminProducts
            .filter((product) => product.status === "published")
            .map(mapAdminProductToCatalog);
    } catch {
        return readJsonFile<Product[]>("products.json");
    }
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
