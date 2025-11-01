// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, setSelectedPost } from '../redux/slices/postsSlice';
import { RootState } from '../redux/store';
import PostCard from '../components/PostCard';
import { fetchPosts } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const posts = useSelector((state: RootState) => state.posts.posts);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const data = await fetchPosts();
            dispatch(setPosts(data));
        } catch (err) {
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handlePostPress = (post: any) => {
        dispatch(setSelectedPost(post));
        navigation.navigate('Details');
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#e91e63" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PostCard post={item} onPress={() => handlePostPress(item)} />
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
});