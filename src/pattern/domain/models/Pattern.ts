import type { User } from './User';

export interface Pattern {
    id?: string;
    user?: User;
    name: string;
    gridData?: string | null;
    size: number;
    isPublic: boolean;
    publishedAt?: string | null;
    createdAt: string;
}
