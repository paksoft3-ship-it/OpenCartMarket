import { Review } from '../types';
import { readJsonFile } from './utils';

export async function getReviews(): Promise<Review[]> {
    return readJsonFile<Review[]>('reviews.json');
}

export async function getReviewsByProduct(productId: string): Promise<Review[]> {
    const reviews = await getReviews();
    return reviews.filter(r => r.productId === productId);
}
