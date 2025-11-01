// src/redux/slices/postsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Post {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: number;
    userId: number;
}

interface PostsState {
    posts: Post[];
    favourites: number[];
    selectedPost: Post | null;
}

const initialState: PostsState = {
    posts: [],
    favourites: [],
    selectedPost: null,
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
        },
        setSelectedPost: (state, action: PayloadAction<Post>) => {
            state.selectedPost = action.payload;
        },
        toggleFavourite: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            if (state.favourites.includes(id)) {
                state.favourites = state.favourites.filter(fav => fav !== id);
            } else {
                state.favourites.push(id);
            }
            // Save to storage
            AsyncStorage.setItem('favourites', JSON.stringify(state.favourites));
        },
        loadFavourites: (state, action: PayloadAction<number[]>) => {
            state.favourites = action.payload;
        },
    },
});

export const { setPosts, setSelectedPost, toggleFavourite, loadFavourites } = postsSlice.actions;
export default postsSlice.reducer;
