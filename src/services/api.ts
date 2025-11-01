// src/services/api.ts
import axios from 'axios';
import { Post } from '../types';

const API_BASE = 'https://dummyjson.com';

export const fetchPosts = async (): Promise<Post[]> => {
    const res = await axios.get(`${API_BASE}/posts?limit=20`);
    return res.data.posts;
};

export const fetchPostById = async (id: number): Promise<Post> => {
    const res = await axios.get(`${API_BASE}/posts/${id}`);
    return res.data;
};