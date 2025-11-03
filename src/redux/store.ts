// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import postsSlice from './slices/postsSlice';
import themeReducer from './slices/themeSlice';
import commentsReducer from './slices/commentsSlice';


export const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postsSlice,
        theme: themeReducer,
        comments: commentsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;