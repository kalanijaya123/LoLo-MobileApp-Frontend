// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    TextInput,
    Animated,
    TouchableOpacity,
    Modal,
    Text,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts, setSelectedPost } from '../redux/slices/postsSlice';
import { RootState } from '../redux/store';
import PostCard from '../components/PostCard';
import { fetchPosts } from '../services/api';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const posts = useSelector((state: RootState) => state.posts.posts);
    const isDark = useSelector((state: RootState) => state.theme.isDarkMode);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [usersMap, setUsersMap] = useState<Record<number, string>>({});
    const [commentsCountMap, setCommentsCountMap] = useState<Record<number, number>>({});

    // FAB & Popup
    const [fabOpen, setFabOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const fabAnim = useRef(new Animated.Value(0)).current;
    const confettiRef = useRef<any>(null);

    // Search (static, centered)

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async (isRefresh = false) => {
        if (!isRefresh) setLoading(true);
        try {
            const data = await fetchPosts();
            dispatch(setPosts(data));

            const userIds = Array.from(new Set(data.map((p: any) => p.userId)));
            const usersResp = await Promise.all(userIds.map(id => fetch(`https://dummyjson.com/users/${id}`)));
            const usersJson = await Promise.all(usersResp.map(r => r.json()));
            const uMap: Record<number, string> = {};
            usersJson.forEach(u => { uMap[u.id] = `${u.firstName} ${u.lastName}`; });
            setUsersMap(uMap);

            const commentsPromises = data.map(p => fetch(`https://dummyjson.com/posts/${p.id}/comments`).then(r => r.json()));
            const commentsResults = await Promise.all(commentsPromises);
            const cMap: Record<number, number> = {};
            data.forEach((p, idx) => { cMap[p.id] = commentsResults[idx].comments.length; });
            setCommentsCountMap(cMap);
        } catch (err) {
            setError('Failed to load posts');
            showPopupMessage('Network error. Pull to retry.', 'error');
        } finally {
            setLoading(false);
            if (isRefresh) setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadPosts(true);
    };

    const handlePostPress = (post: any) => {
        dispatch(setSelectedPost(post));
        navigation.navigate('Details');
    };

    // Note: removed animated minimizing effect; search container is static and centered.

    const toggleFAB = () => {
        const toValue = fabOpen ? 0 : 1;
        Animated.spring(fabAnim, {
            toValue,
            friction: 8,
            useNativeDriver: true,
        }).start();
        setFabOpen(!fabOpen);
    };

    const showPopupMessage = (msg: string, type: 'success' | 'error') => {
        setPopupMessage(msg);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
        if (type === 'success' && confettiRef.current) {
            confettiRef.current.start();
        }
    };

    const addMockPost = () => {
        const newPost = {
            id: Date.now(),
            title: "New Travel Tip",
            body: "Just added a new destination to explore!",
            userId: 1,
            reactions: { likes: 0, dislikes: 0 },
            tags: ['travel', 'new'],
        };
        dispatch(setPosts([newPost, ...posts]));
        showPopupMessage("Post added!", 'success');
        toggleFAB();
    };

    const filtered = posts.filter((p: any) => {
        const q = searchQuery.toLowerCase();
        if (!q) return true;
        const username = usersMap[p.userId] || '';
        return (
            p.title.toLowerCase().includes(q) ||
            p.body.toLowerCase().includes(q) ||
            username.toLowerCase().includes(q)
        );
    });

    // Skeleton Card
    const SkeletonCard = () => (
        <Animatable.View animation="pulse" iterationCount="infinite" style={[styles.skeletonCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            <View style={[styles.skeletonImage, { backgroundColor: isDark ? '#111' : '#eee' }]} />
            <View style={[styles.skeletonLine, { backgroundColor: isDark ? '#333' : '#eee' }]} />
            <View style={[styles.skeletonLine, { width: '70%', backgroundColor: isDark ? '#333' : '#eee' }]} />
        </Animatable.View>
    );

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
            {/* Search Bar (centered) */}
            <View style={[styles.searchContainer, { backgroundColor: isDark ? '#000' : '#e68f8fff' }]}>
                <TextInput
                    placeholder="Search..."
                    placeholderTextColor={'#fff'}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={[styles.searchInput, isDark && styles.inputDark]}
                />
                <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchIcon}>
                    <Feather name="search" size={20} color={isDark ? '#fff' : '#666'} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            {loading ? (
                <FlatList
                    data={[1, 2, 3, 4]}
                    renderItem={() => <SkeletonCard />}
                    keyExtractor={(_, i) => i.toString()}
                    contentContainerStyle={{ padding: 16, paddingTop: 16 }}
                />
            ) : error ? (
                <View style={styles.center}>
                    <Text style={{ color: isDark ? '#ff6b6b' : 'red' }}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <PostCard
                            post={item}
                            onPress={() => handlePostPress(item)}
                            username={usersMap[item.userId]}
                            commentsCount={commentsCountMap[item.id]}
                        />
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e91e63']} />
                    }
                    contentContainerStyle={{ padding: 16, paddingBottom: 80, paddingTop: 16 }}
                />
            )}

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={toggleFAB}>
                <Animated.View style={{
                    transform: [{
                        rotate: fabAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '45deg'],
                        })
                    }]
                }}>
                    <Feather name="plus" size={28} color="#fff" />
                </Animated.View>
            </TouchableOpacity>

            {/* FAB Menu */}
            <Animated.View style={[
                styles.fabMenu,
                {
                    transform: [{
                        translateY: fabAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [100, 0],
                        })
                    }],
                    opacity: fabAnim,
                }
            ]}>
                <TouchableOpacity style={styles.fabItem} onPress={addMockPost}>
                    <Feather name="edit-3" size={50} color="#fff" />
                    <Text style={styles.fabLabel}>Add Post</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Success Popup */}
            <Modal transparent visible={showPopup} animationType="fade">
                <View style={styles.popupOverlay}>
                    <Animatable.View
                        animation="bounceIn"
                        style={[styles.popup, popupMessage.includes('error') && styles.popupError]}
                    >
                        <Text style={styles.popupText}>{popupMessage}</Text>
                    </Animatable.View>
                </View>
                {popupMessage.includes('added') && <ConfettiCannon count={50} origin={{ x: -10, y: 0 }} ref={confettiRef} />}
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16,
        backgroundColor: '#af7474ff',
        borderRadius: 25,
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    searchCenter: {
        position: 'absolute',
        left: 16,
        right: 16,
        top: '45%',
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    searchInput: {
        flex: 1,
        paddingHorizontal: 40,
        paddingVertical: 10,
        fontSize: 16,
    },
    inputDark: { backgroundColor: '#333', color: '#fff' },
    searchIcon: { padding: 12 },

    skeletonCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
    },
    skeletonImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginBottom: 12,
    },
    skeletonLine: {
        height: 16,
        backgroundColor: '#eee',
        borderRadius: 4,
        marginBottom: 8,
    },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#e91e63',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
    },
    fabMenu: {
        position: 'absolute',
        right: 20,
        bottom: 90,
        backgroundColor: '#e91e63',
        borderRadius: 12,
        padding: 12,
        elevation: 6,
    },
    fabItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fabLabel: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: '600',
    },

    popupOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: '#4caf50',
        padding: 20,
        borderRadius: 12,
        elevation: 5,
    },
    popupError: { backgroundColor: '#f44336' },
    popupText: { color: '#fff', fontWeight: 'bold' },
});