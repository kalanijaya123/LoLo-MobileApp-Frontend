// src/components/PostCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavourite } from '../redux/slices/postsSlice';
import { RootState } from '../redux/store';
import { Post } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface Props {
    post: Post;
    onPress: () => void;
}

export default function PostCard({ post, onPress }: Props) {
    const dispatch = useDispatch();
    const favourites = useSelector((state: RootState) => state.posts.favourites);
    const isFav = favourites.includes(post.id);

    const handleFavourite = (e: any) => {
        e.stopPropagation();
        dispatch(toggleFavourite(post.id));
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Image
                source={{ uri: `https://picsum.photos/400/300?random=${post.id}` }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
                <Text style={styles.body} numberOfLines={2}>{post.body}</Text>
                <View style={styles.footer}>
                    <Text style={styles.reactions}>Likes {post.reactions}</Text>
                    <TouchableOpacity onPress={handleFavourite}>
                        <Feather
                            name={'heart'}
                            size={22}
                            color={isFav ? '#e91e63' : '#666'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 16,
        margin: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: 'hidden',
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
        color: '#555',
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reactions: {
        fontSize: 14,
        color: '#e91e63',
        fontWeight: '600',
    },
});