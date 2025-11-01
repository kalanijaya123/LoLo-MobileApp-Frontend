// src/types/index.ts
export interface Post {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: number;
    userId: number;
}