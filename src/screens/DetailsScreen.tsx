// src/screens/DetailsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setComments, addComment } from '../redux/slices/commentsSlice';
import { Feather } from '@expo/vector-icons';

export default function DetailsScreen() {
    const dispatch = useDispatch();
    const post = useSelector((state: RootState) => state.posts.selectedPost);
    const comments = useSelector((state: RootState) => state.comments[post?.id || 0] || []);
    const user = useSelector((state: RootState) => state.auth.user);
    const isDark = useSelector((state: RootState) => state.theme.isDarkMode);

    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const insets = useSafeAreaInsets();
    const INPUT_HEIGHT = 88; // increased space reserved for the input bar
    const TAB_BAR_HEIGHT = 56; // approximate bottom tab bar height to position input above it

    useEffect(() => {
        if (post) {
            fetchComments(post.id);
        }
    }, [post]);

    const fetchComments = async (postId: number) => {
        setLoading(true);
        try {
            const res = await fetch(`https://dummyjson.com/posts/${postId}/comments`);
            const data = await res.json();
            dispatch(setComments({ postId, comments: data.comments }));
        } catch (error) {
            console.log('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = () => {
        if (!commentText.trim() || !user || !post) return;

        const newComment = {
            id: Date.now(),
            body: commentText,
            postId: post.id,
            user: { username: user.username },
        };

        dispatch(addComment({ postId: post.id, comment: newComment }));
        setCommentText('');
    };

    if (!post) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
                <Text style={{ color: isDark ? '#ddd' : '#000' }}>No post selected</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView
                style={[styles.container, { backgroundColor: isDark ? '#121212' : '#fff' }]}
                contentContainerStyle={{ paddingBottom: INPUT_HEIGHT + insets.bottom + TAB_BAR_HEIGHT + 16 }}
            >
                <Image
                    source={{ uri: `https://picsum.photos/400/300?random=${post.id}` }}
                    style={styles.image}
                />
                <View style={styles.content}>
                    <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                        {post.title}
                    </Text>
                    <Text style={[styles.body, { color: isDark ? '#ccc' : '#444' }]}>
                        {post.body}
                    </Text>

                    <View style={styles.meta}>
                        <Text style={styles.reactions}>
                            <Feather name="heart" size={16} color="#e91e63" /> {post.reactions.likes} Likes
                        </Text>
                        <Text style={[styles.tags, { color: isDark ? '#aaa' : '#666' }]}>
                            {post.tags.map(t => `#${t}`).join(' ')}
                        </Text>
                    </View>

                    {/* Comments Section */}
                    <View style={styles.commentsSection}>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
                            Comments ({comments.length})
                        </Text>

                        {loading ? (
                            <ActivityIndicator size="small" color="#e91e63" style={{ marginVertical: 20 }} />
                        ) : (
                            <View>
                                {comments.map(comment => (
                                    <View key={comment.id} style={[styles.comment, isDark && styles.commentDark]}>
                                        <Text style={[styles.commentUser, { color: isDark ? '#aaa' : '#666' }]}>
                                            @{comment.user.username}
                                        </Text>
                                        <Text style={[styles.commentBody, { color: isDark ? '#ddd' : '#333' }]}>
                                            {comment.body}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Add Comment Input */}
            {user && (
                <View
                    style={[
                        styles.inputContainer,
                        isDark && styles.inputContainerDark,
                        {
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: insets.bottom + TAB_BAR_HEIGHT + 12,
                            height: INPUT_HEIGHT - 12,
                            paddingHorizontal: 12,
                            alignItems: 'center',
                            flexDirection: 'row',
                        },
                    ]}
                >
                    <TextInput
                        style={[styles.input, isDark && styles.inputDark]}
                        placeholder="Add a comment..."
                        placeholderTextColor={isDark ? '#888' : '#aaa'}
                        value={commentText}
                        onChangeText={setCommentText}
                    />
                    <TouchableOpacity onPress={handleAddComment} style={styles.sendButton}>
                        <Feather name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    image: { width: '100%', height: 300 },
    content: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    body: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
    meta: { marginTop: 10 },
    reactions: { fontSize: 16, color: '#e91e63', marginBottom: 8 },
    tags: { fontSize: 14, fontStyle: 'italic' },

    commentsSection: { marginTop: 30 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },

    comment: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
    },
    commentDark: { backgroundColor: '#1e1e1e' },
    commentUser: { fontSize: 13, fontWeight: '600', marginBottom: 4 },
    commentBody: { fontSize: 15 },

    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    inputContainerDark: {
        backgroundColor: '#1e1e1e',
        borderTopColor: '#333',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 20,
        marginRight: 10,
        fontSize: 15,
    },
    inputDark: { backgroundColor: '#333', color: '#fff' },
    sendButton: {
        backgroundColor: '#e91e63',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});