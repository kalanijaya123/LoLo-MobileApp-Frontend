// src/components/PostCardMini.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Feather } from '@expo/vector-icons';

interface Post {
    id: number;
    title: string;
    body: string;
    reactions: { likes: number; dislikes?: number };
}

interface Props {
    post: Post;
    onPress: () => void;
}

export default function PostCardMini({ post, onPress }: Props) {
    const isDark = useSelector((state: RootState) => state.theme.isDarkMode);

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, isDark && styles.containerDark]}>
            <Image
                source={{ uri: `https://picsum.photos/200/200?random=${post.id}` }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]} numberOfLines={2}>
                    {post.title}
                </Text>
                <View style={styles.footer}>
                    <Text style={styles.likes}>
                        <Feather name="heart" size={12} color="#e91e63" /> {post.reactions.likes}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '31%',
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        margin: '1%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    containerDark: {
        backgroundColor: '#1e1e1e',
    },
    image: {
        width: '100%',
        height: 80,
    },
    content: {
        padding: 8,
    },
    title: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    likes: {
        fontSize: 10,
        color: '#e91e63',
    },
});