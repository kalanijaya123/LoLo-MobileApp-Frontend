// src/screens/Auth/RegisterScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <Text style={styles.info}>Registration not required for demo</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 28, textAlign: 'center', marginBottom: 20 },
    info: { textAlign: 'center', color: '#666', marginBottom: 20 },
    button: { backgroundColor: '#e91e63', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontWeight: 'bold' },
});