import type { UserDto } from './UserDto';

export interface PatternDto {
    id?: string;
    user: UserDto;
    name: string;
    gridData?: string | null;
    size: number;
    isPublic: boolean;
    publishedAt?: string | null;
    createdAt: string;
}

export interface PatternRequestDto {
    name: string;
    size: number;
}
