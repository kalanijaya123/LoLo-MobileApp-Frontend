// src/screens/DetailsScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Feather } from '@expo/vector-icons';

export default function DetailsScreen() {
    const post = useSelector((state: RootState) => state.posts.selectedPost);

    if (!post) {
        return (
            <View style={styles.center}>
                <Text>No post selected</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: `https://picsum.photos/400/300?random=${post.id}` }}
                style={styles.image}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{post.title}</Text>
                <Text style={styles.body}>{post.body}</Text>
                <View style={styles.meta}>
                    <Text style={styles.reactions}>
                        <Feather name="heart" size={16} color="#e91e63" /> {post.reactions} Likes
                    </Text>
                    <Text style={styles.tags}>
                        {post.tags.map(t => `#${t}`).join(' ')}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    image: { width: '100%', height: 300 },
    content: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
    body: { fontSize: 16, color: '#444', lineHeight: 24, marginBottom: 20 },
    meta: { marginTop: 10 },
    reactions: { fontSize: 16, color: '#e91e63', marginBottom: 8 },
    tags: { fontSize: 14, color: '#666', fontStyle: 'italic' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});