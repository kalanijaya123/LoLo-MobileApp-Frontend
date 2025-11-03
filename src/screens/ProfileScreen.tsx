// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import PostCardMini from '../components/PostCardMini';

export default function ProfileScreen() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const isDark = useSelector((state: RootState) => state.theme.isDarkMode);

    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([]);
    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    // Fetch user's posts
    useEffect(() => {
        if (user) {
            fetchUserPosts(user.id);
        }
    }, [user]);

    const pickRandom = (arr: any[], n: number) => {
        const copy = [...arr];
        const out: any[] = [];
        while (out.length < n && copy.length) {
            const idx = Math.floor(Math.random() * copy.length);
            out.push(copy.splice(idx, 1)[0]);
        }
        return out;
    };

    const fetchUserPosts = async (userId: number) => {
        setLoadingPosts(true);
        try {
            const res = await fetch(`https://dummyjson.com/posts/user/${userId}`);
            const data = await res.json();
            let posts = data.posts || [];

            // If backend doesn't return any user posts, fetch some random posts
            if (!posts || posts.length === 0) {
                try {
                    const allRes = await fetch(`https://dummyjson.com/posts?limit=50`);
                    const allJson = await allRes.json();
                    const allPosts = allJson.posts || [];
                    posts = pickRandom(allPosts, 9);
                } catch (innerErr) {
                    console.log('Failed to fetch fallback posts', innerErr);
                }
            }

            setUserPosts(posts);
        } catch (error) {
            console.log('Failed to load user posts', error);
        } finally {
            setLoadingPosts(false);
        }
    };

    const handleChangeImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 1,
        });
        if (!result.canceled) {
            const newUris = result.assets.map(a => a.uri);
            setGallery([...gallery, ...newUris]);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigation.replace('Auth');
    };

    const handleEditProfile = () => {
        navigation.navigate('EditProfile');
    };

    const handlePostPress = (post: any) => {
        dispatch({ type: 'posts/setSelectedPost', payload: post });
        navigation.navigate('Details');
    };

    const renderItem = ({ item }: { item: any }) => {
        if (gallery.includes(item)) {
            return <Image source={{ uri: item }} style={styles.galleryItem} />;
        }
        return <PostCardMini post={item} onPress={() => handlePostPress(item)} />;
    };

    const data = [...userPosts, ...gallery];

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
            {/* Profile Card */}
            <View style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#fff' }]}>
                <TouchableOpacity style={styles.editIcon} onPress={handleEditProfile}>
                    <Ionicons name="create-outline" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>

                <View style={styles.avatarContainer}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                    ) : (
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user?.username[0].toUpperCase()}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.cameraIcon} onPress={handleChangeImage}>
                        <Ionicons name="camera-outline" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>{user?.username}</Text>
                <Text style={[styles.email, { color: isDark ? '#aaa' : '#666' }]}>{user?.email}</Text>
            </View>

            {/* Gallery Header */}
            <View style={styles.galleryHeader}>
                <Text style={[styles.galleryTitle, { color: isDark ? '#fff' : '#000' }]}>
                    Your Posts & Uploads
                </Text>
                <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
                    <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
                    <Text style={styles.uploadText}>Upload</Text>
                </TouchableOpacity>
            </View>

            {/* Grid */}
            {loadingPosts ? (
                <ActivityIndicator size="small" color="#e91e63" style={{ margin: 20 }} />
            ) : data.length === 0 ? (
                <Text style={[styles.noContent, { color: isDark ? '#888' : '#666' }]}>
                    No posts or uploads yet.
                </Text>
            ) : (
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => (typeof item === 'string' ? item : item.id.toString())}
                    numColumns={3}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}

            {/* Logout */}
            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    card: {
        alignItems: 'center',
        marginBottom: 20,
        borderRadius: 12,
        paddingVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        position: 'relative',
    },
    editIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
        padding: 5,
    },
    avatarContainer: { position: 'relative' },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 10,
    },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#e91e63',
        borderRadius: 20,
        padding: 5,
    },
    name: { fontSize: 22, fontWeight: 'bold' },
    email: { fontSize: 16 },
    galleryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    galleryTitle: { fontSize: 18, fontWeight: 'bold' },
    uploadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e91e63',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    uploadText: { color: '#fff', marginLeft: 6, fontWeight: 'bold' },
    galleryItem: {
        width: '31%',
        height: 100,
        borderRadius: 8,
        margin: '1%',
    },
    noContent: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    logout: {
        backgroundColor: '#e91e63',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutText: { color: '#fff', fontWeight: 'bold' },
});