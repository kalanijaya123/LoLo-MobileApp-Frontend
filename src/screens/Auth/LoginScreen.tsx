// src/screens/Auth/LoginScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const schema = yup.object({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required'),
});

type FormData = {
    username: string;
    password: string;
};

export default function LoginScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await axios.post('https://dummyjson.com/auth/login', {
                username: data.username,
                password: data.password,
            });

            const { id, username, email, token } = res.data;

            dispatch(setCredentials({
                user: { id, username, email },
                token,
            }));

            navigation.replace('Main');
        } catch (err: any) {
            Alert.alert('Login Failed', err.response?.data?.message || 'Invalid credentials');
        }
    };

    // Auto-login if already logged in
    useEffect(() => {
        (async () => {
            const auth = await AsyncStorage.getItem('auth');
            if (auth) {
                navigation.replace('Main');
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>LoLo Login</Text>

            <Controller
                control={control}
                name="username"
                render={({ field }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={field.value}
                        onChangeText={field.onChange}
                    />
                )}
            />
            {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

            <Controller
                control={control}
                name="password"
                render={({ field }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={field.value}
                        onChangeText={field.onChange}
                    />
                )}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
    input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 10 },
    error: { color: 'red', marginBottom: 10 },
    button: { backgroundColor: '#e91e63', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { color: '#e91e63', textAlign: 'center', marginTop: 15 },
});