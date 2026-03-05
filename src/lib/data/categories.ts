import { Category } from '../types';
import { readJsonFile } from './utils';

export async function getCategories(): Promise<Category[]> {
    return readJsonFile<Category[]>('categories.json');
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = await getCategories();
    return categories.find(c => c.slug === slug) || null;
}
