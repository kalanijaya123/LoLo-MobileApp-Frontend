// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();

    const [darkMode, setDarkMode] = React.useState(Appearance.getColorScheme() === 'dark');

    const toggleDarkMode = async (value: boolean) => {
        setDarkMode(value);
        await AsyncStorage.setItem('darkMode', value ? 'dark' : 'light');
        // In real app: update theme context
    };

    const handleLogout = () => {
        dispatch(logout());
        navigation.replace('Auth');
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{user?.username[0].toUpperCase()}</Text>
                </View>
                <Text style={styles.name}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
            </View>

            <View style={styles.setting}>
                <Text style={styles.label}>Dark Mode</Text>
                <Switch value={darkMode} onValueChange={toggleDarkMode} />
            </View>

            <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    card: { alignItems: 'center', marginBottom: 30 },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
    name: { fontSize: 22, fontWeight: 'bold' },
    email: { fontSize: 16, color: '#666' },
    setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
    label: { fontSize: 16 },
    logout: { backgroundColor: '#e91e63', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    logoutText: { color: '#fff', fontWeight: 'bold' },
});