// src/screens/Auth/LoginScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';

const schema = yup.object({
    username: yup.string().min(3).required('Username is required'),
    password: yup.string().min(4).required('Password is required'),
});

type FormData = {
    username: string;
    password: string;
};

export default function LoginScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        // MOCK LOGIN: Accept any username/password (as long as validated)
        const mockUser = {
            id: 999,
            username: data.username,
            email: `${data.username}@lolo.app`,
        };

        dispatch(setCredentials({
            user: mockUser,
            token: 'mock-jwt-token',
        }));

        // Save to AsyncStorage
        await AsyncStorage.setItem('auth', JSON.stringify({
            user: mockUser,
            token: 'mock-jwt-token',
        }));

        navigation.replace('Main');
    };

    // Auto-login if already logged in
    useEffect(() => {
        (async () => {
            const auth = await AsyncStorage.getItem('auth');
            if (auth) navigation.replace('Main');
        })();
    }, [navigation]);

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
                        autoCapitalize="none"
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
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Password"
                            secureTextEntry={!showPassword}
                            value={field.value}
                            onChangeText={field.onChange}
                        />
                        <TouchableOpacity
                            style={styles.eye}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Feather name={showPassword ? 'eye' : 'eye-off'} size={22} color="#666" />
                        </TouchableOpacity>
                    </View>
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
    passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10 },
    passwordInput: { flex: 1, padding: 15 },
    eye: { paddingHorizontal: 12 },
    error: { color: 'red', marginBottom: 10 },
    button: { backgroundColor: '#e91e63', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    link: { color: '#e91e63', textAlign: 'center', marginTop: 15 },
});