import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavourite } from '../redux/slices/postsSlice';
import { addComment } from '../redux/slices/commentsSlice';
import { RootState } from '../redux/store';
import { Post } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface Props {
    post: Post;
    onPress: () => void;
    username?: string;
    commentsCount?: number;
}

export default function PostCard({ post, onPress, username, commentsCount }: Props) {
    const dispatch = useDispatch();
    const favourites = useSelector((state: RootState) => state.posts.favourites);
    const isFav = favourites.includes(post.id);
    const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
    const user = useSelector((state: RootState) => state.auth.user);
    const [showCommentInput, setShowCommentInput] = React.useState(false);
    const [localComment, setLocalComment] = React.useState('');

    const handleFavourite = (e: any) => {
        e.stopPropagation();
        dispatch(toggleFavourite(post.id));
    };

    return (
        <TouchableOpacity
            style={[
                styles.card,
                { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#555' : '#ddd' },
            ]}
            onPress={onPress}
        >
            <Image
                source={{ uri: `https://picsum.photos/400/300?random=${post.id}` }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text
                    style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}
                    numberOfLines={2}
                >
                    {post.title}
                </Text>
                {username && (
                    <Text style={[styles.uploader, { color: isDarkMode ? '#bbb' : '#777' }]}>Uploaded by {username}</Text>
                )}
                <Text
                    style={[styles.body, { color: isDarkMode ? '#bbb' : '#555' }]}
                    numberOfLines={2}
                >
                    {post.body}
                </Text>
                <View style={styles.footer}>
                    <Text style={[styles.reactions, { color: '#e91e63' }]}>Likes {post.reactions.likes}</Text>
                    <Text style={[styles.commentsCount, { color: isDarkMode ? '#ccc' : '#666' }]}>
                        {typeof commentsCount !== 'undefined' ? commentsCount : 0} comments
                    </Text>
                    <TouchableOpacity onPress={() => setShowCommentInput(s => !s)} style={{ marginLeft: 8, marginRight: 6 }}>
                        <Feather name="message-circle" size={20} color={isDarkMode ? '#ccc' : '#666'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleFavourite}>
                        <Feather
                            name="heart"
                            size={22}
                            color={isFav ? '#e91e63' : isDarkMode ? '#ccc' : '#666'}
                        />
                    </TouchableOpacity>
                </View>
                {showCommentInput && (
                    <View style={{ marginTop: 10 }}>
                        <View style={[styles.commentInputWrapper, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fafafa' }]}>
                            <TextInput
                                value={localComment}
                                onChangeText={setLocalComment}
                                placeholder={user ? 'Write a comment...' : 'Login to comment'}
                                placeholderTextColor={isDarkMode ? '#888' : '#999'}
                                editable={!!user}
                                style={[styles.commentInput, { color: isDarkMode ? '#fff' : '#000' }]}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    if (!localComment.trim() || !user) return;
                                    const newComment = { id: Date.now(), body: localComment.trim(), postId: post.id, user: { username: user.username } };
                                    dispatch(addComment({ postId: post.id, comment: newComment }));
                                    setLocalComment('');
                                    setShowCommentInput(false);
                                }}
                                style={styles.sendButtonSmall}
                            >
                                <Feather name="send" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        borderRadius: 16,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
        borderWidth: 1,
    },
    image: {
        width: '100%',
        height: 180,
    },
    content: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    body: {
        fontSize: 14,
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reactions: {
        fontSize: 14,
        fontWeight: '600',
    },
    uploader: {
        fontSize: 12,
        marginBottom: 6,
    },
    commentsCount: {
        fontSize: 13,
        marginRight: 8,
    },
    sendButtonSmall: {
        backgroundColor: '#e91e63',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 12,
    },
    commentInput: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        fontSize: 14,
        marginRight: 8,
        backgroundColor: 'transparent',
    },
});
