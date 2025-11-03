// src/screens/FavouritesScreen.tsx
import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import PostCard from '../components/PostCard';
import { useNavigation } from '@react-navigation/native';

export default function FavouritesScreen() {
    const posts = useSelector((state: RootState) => state.posts.posts);
    const favourites = useSelector((state: RootState) => state.posts.favourites);
    const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
    const navigation = useNavigation<any>();

    const favPosts = posts.filter(post => favourites.includes(post.id));

    const handlePostPress = (post: any) => {
        navigation.navigate('Details', { post });
    };

    if (favPosts.length === 0) {
        return (
            <View style={[styles.center, { backgroundColor: isDark ? '#121212' : '#fff' }]}>
                <Text style={[styles.empty, { color: isDark ? '#ccc' : '#666' }]}>No favourites yet</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            <FlatList
                data={favPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PostCard post={item} onPress={() => handlePostPress(item)} />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    empty: { fontSize: 18, color: '#666' },
});