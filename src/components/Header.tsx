// src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function Header() {
    const user = useSelector((state: RootState) => state.auth.user);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LoLo</Text>
            {user && <Text style={styles.username}>Hi, {user.username}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#e91e63',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    username: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});