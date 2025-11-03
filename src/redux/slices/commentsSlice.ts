// src/redux/slices/commentsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Comment {
    id: number;
    body: string;
    postId: number;
    user: { username: string };
}

interface CommentsState {
    [postId: number]: Comment[];
}

const initialState: CommentsState = {};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setComments: (state, action: PayloadAction<{ postId: number; comments: Comment[] }>) => {
            const { postId, comments } = action.payload;
            state[postId] = comments;
            AsyncStorage.setItem('comments', JSON.stringify(state));
        },
        addComment: (state, action: PayloadAction<{ postId: number; comment: Comment }>) => {
            const { postId, comment } = action.payload;
            if (!state[postId]) state[postId] = [];
            state[postId].unshift(comment);
            AsyncStorage.setItem('comments', JSON.stringify(state));
        },
        loadComments: (state, action: PayloadAction<CommentsState>) => {
            return action.payload;
        },
    },
});

export const { setComments, addComment, loadComments } = commentsSlice.actions;
export default commentsSlice.reducer;