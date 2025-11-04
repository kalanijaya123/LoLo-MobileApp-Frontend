// src/screens/ChatScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
    const chats = useSelector((state: any) => state.allChats ?? []);
    const isDarkMode = useSelector((state: any) => state.theme?.isDarkMode ?? false);
    const navigation = useNavigation<any>();

    const [localChats, setLocalChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const fabAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        loadDummyChats();
        animateFAB();
    }, []);

    const animateFAB = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fabAnim, { toValue: 1, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
                Animated.timing(fabAnim, { toValue: 0, duration: 800, easing: Easing.in(Easing.ease), useNativeDriver: true }),
            ])
        ).start();
    };

    const loadDummyChats = async (isRefresh = false) => {
        if (!isRefresh && chats.length) {
            setLoading(false);
            return;
        }
        if (!isRefresh) setLoading(true);
        try {
            const res = await fetch('https://dummyjson.com/users?limit=12');
            const json = await res.json();
            const users = json.users || [];
            const mapped = users.map((u: any) => ({
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                lastMessage: u.company?.title ? `Works at ${u.company.title}` : `Hey! How are you?`,
                avatar: `https://i.pravatar.cc/150?u=${u.id}`,
                time: '2 min ago',
                unread: Math.random() > 0.5 ? Math.floor(Math.random() * 5) : 0,
            }));
            setLocalChats(mapped);
        } catch (err) {
            console.warn('Failed to load dummy chats', err);
        } finally {
            setLoading(false);
            if (isRefresh) setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadDummyChats(true);
    };

    const renderChatItem = ({ item }: any) => (
        <Animatable.View animation="fadeInUp" duration={400} delay={100}>
            <TouchableOpacity
                style={[styles.chatItem, isDarkMode && styles.chatItemDark]}
                onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={isDarkMode ? ['#6a11cb', '#2575fc'] : ['#e91e63', '#ff6b6b']}
                    style={styles.avatarGradient}
                >
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.name[0]}</Text>
                    </View>
                </LinearGradient>

                <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                        <Text style={[styles.chatName, { color: isDarkMode ? '#fff' : '#000' }]}>{item.name}</Text>
                        <Text style={[styles.chatTime, { color: isDarkMode ? '#aaa' : '#888' }]}>{item.time}</Text>
                    </View>
                    <Text style={[styles.chatMessage, { color: isDarkMode ? '#ccc' : '#666' }]} numberOfLines={1}>
                        {item.lastMessage}
                    </Text>
                </View>

                {item.unread > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </Animatable.View>
    );

    const SkeletonItem = () => (
        <View style={[styles.chatItem, isDarkMode && styles.chatItemDark]}>
            <View style={[styles.avatarGradient, { backgroundColor: isDarkMode ? '#333' : '#eee' }]} />
            <View style={styles.chatContent}>
                <View style={[styles.skeletonLine, { width: '60%', backgroundColor: isDarkMode ? '#2a2a2a' : '#eee' }]} />
                <View style={[styles.skeletonLine, { width: '80%', marginTop: 6, backgroundColor: isDarkMode ? '#2a2a2a' : '#eee' }]} />
            </View>
        </View>
    );

    const data = chats.length ? chats : localChats;

    return (
        <LinearGradient
            colors={isDarkMode ? ['#121212', '#1e1e1e'] : ['#f5f5f5', '#fff']}
            style={styles.container}
        >
            <FlatList
                data={loading ? [1, 2, 3, 4] : data}
                keyExtractor={(item) => (loading ? item.toString() : item.id.toString())}
                renderItem={loading ? () => <SkeletonItem /> : renderChatItem}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#e91e63']} />
                }
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Feather name="message-circle" size={48} color={isDarkMode ? '#666' : '#ccc'} />
                        <Text style={[styles.emptyText, { color: isDarkMode ? '#aaa' : '#666' }]}>
                            No chats yet. Start a new one!
                        </Text>
                    </View>
                }
            />

            {/* Animated FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('NewChat')}
                activeOpacity={0.9}
            >
                <Animated.View
                    style={{
                        transform: [
                            {
                                scale: fabAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 1.15],
                                }),
                            },
                        ],
                    }}
                >
                    <LinearGradient colors={['#e91e63', '#ff6b6b']} style={styles.fabGradient}>
                        <Feather name="plus" size={28} color="#fff" />
                    </LinearGradient>
                </Animated.View>
            </TouchableOpacity>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    chatItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    chatItemDark: {
        backgroundColor: '#1e1e1e',
    },
    avatarGradient: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    chatContent: {
        flex: 1,
        justifyContent: 'center',
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatName: {
        fontSize: 16,
        fontWeight: '600',
    },
    chatTime: {
        fontSize: 12,
    },
    chatMessage: {
        fontSize: 14,
        marginTop: 4,
    },
    unreadBadge: {
        backgroundColor: '#e91e63',
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    skeletonLine: {
        height: 14,
        backgroundColor: '#eee',
        borderRadius: 4,
    },
    empty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
    },
    fabGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});