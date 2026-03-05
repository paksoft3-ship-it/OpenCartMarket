import { Developer } from '../types';
import { readJsonFile } from './utils';

export async function getDevelopers(): Promise<Developer[]> {
    return readJsonFile<Developer[]>('developers.json');
}

export async function getDeveloperById(id: string): Promise<Developer | null> {
    const developers = await getDevelopers();
    return developers.find(d => d.id === id) || null;
}
