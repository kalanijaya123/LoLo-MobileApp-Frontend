// src/screens/Auth/LoginScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Dimensions,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setCredentials } from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFonts, Inter_700Bold, Inter_400Regular } from '@expo-google-fonts/inter';

const { width, height } = Dimensions.get('window');

const schema = yup.object({
    username: yup.string().min(3).required('Username is required'),
    password: yup.string().min(4).required('Password is required'),
});

type FormData = { username: string; password: string };

/* ────── RED HEART RAIN ────── */
const HeartRain = () => {
    const hearts = Array.from({ length: 15 }, (_, i) => {
        const anim = useRef(new Animated.Value(-100)).current;
        const left = Math.random() * (width - 50);
        const duration = 2000 + Math.random() * 2000;
        const size = 20 + Math.random() * 15;

        useEffect(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(anim, {
                        toValue: height + 100,
                        duration,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, { toValue: -100, duration: 0, useNativeDriver: true }),
                ])
            ).start();
        }, []);

        return (
            <Animated.View
                key={i}
                style={{
                    position: 'absolute',
                    left,
                    transform: [{ translateY: anim }],
                }}
            >
                <Feather name="heart" size={size} color="#e91e63" />
            </Animated.View>
        );
    });

    return <>{hearts}</>;
};

export default function LoginScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
    const [showPassword, setShowPassword] = useState(false);
    const [showHearts, setShowHearts] = useState(false);
    const [fontsLoaded] = useFonts({ Inter_700Bold, Inter_400Regular });

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    // ---- Focus states for custom border colour ----
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const logoScale = useRef(new Animated.Value(0.3)).current;
    const cardY = useRef(new Animated.Value(100)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;

    // ---- Animations on mount ----
    useEffect(() => {
        if (fontsLoaded) {
            Animated.parallel([
                Animated.spring(logoScale, { toValue: 1, friction: 7, useNativeDriver: true }),
                Animated.timing(cardOpacity, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
                Animated.timing(cardY, { toValue: 0, duration: 600, delay: 300, useNativeDriver: true }),
            ]).start();
        }
    }, [fontsLoaded]);

    // Note: auto-login behaviour removed so the app always shows the Login screen
    // on cold start. Previously this effect read AsyncStorage and redirected
    // immediately to the main app if an 'auth' entry existed.

    // ---- Mock login + heart rain ----
    const onSubmit = async (data: FormData) => {
        const mockUser = {
            id: Math.floor(Math.random() * 1000),
            username: data.username,
            email: `${data.username.toLowerCase()}@lolo.app`,
        };

        dispatch(setCredentials({ user: mockUser, token: 'mock-jwt-token-12345' }));
        await AsyncStorage.setItem(
            'auth',
            JSON.stringify({ user: mockUser, token: 'mock-jwt-token-12345' })
        );

        setShowHearts(true);
        setTimeout(() => {
            setShowHearts(false);
            navigation.replace('Main');
        }, 2200);
    };

    if (!fontsLoaded) return null;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient
                colors={isDark ? ['#1e1e1e', '#121212'] : ['#dfdedeff', '#d9d9d9ff', '#860a0aff']}
                style={styles.container}
            >
                {/* Heart Rain */}
                {showHearts && <HeartRain />}

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    {/* Logo */}
                    <Animated.View style={[styles.logoWrapper, { transform: [{ scale: logoScale }] }]}>
                        <Image source={require('../../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
                    </Animated.View>

                    {/* Card */}
                    <Animated.View
                        style={[
                            styles.card,
                            { opacity: cardOpacity, transform: [{ translateY: cardY }], backgroundColor: isDark ? '#1e1e1e' : '#fff' },
                        ]}
                    >
                        <Text style={styles.title}>Login</Text>

                        {/* Username */}
                        <Controller
                            control={control}
                            name="username"
                            render={({ field }) => (
                                <View
                                    style={[
                                        styles.inputWrapper,
                                        usernameFocused && styles.inputWrapperFocused,
                                        { backgroundColor: isDark ? '#2a2a2a' : '#fafafa', borderColor: isDark ? '#333' : '#eee' },
                                    ]}
                                >
                                    <Feather name="user" size={20} color="#8a7e7eff" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Username"
                                        autoCapitalize="none"
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        onFocus={() => setUsernameFocused(true)}
                                        onBlur={() => setUsernameFocused(false)}
                                    />
                                </View>
                            )}
                        />
                        {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

                        {/* Password */}
                        <Controller
                            control={control}
                            name="password"
                            render={({ field }) => (
                                <View
                                    style={[
                                        styles.inputWrapper,
                                        passwordFocused && styles.inputWrapperFocused,
                                        { backgroundColor: isDark ? '#2a2a2a' : '#fafafa', borderColor: isDark ? '#333' : '#eee' },
                                    ]}
                                >
                                    <Feather name="lock" size={20} color="#999" style={styles.icon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        secureTextEntry={!showPassword}
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        onFocus={() => setPasswordFocused(true)}
                                        onBlur={() => setPasswordFocused(false)}
                                    />
                                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                        <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#999" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                        {/* Login Button */}
                        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                            <LinearGradient colors={['#e91e63', '#ff6b6b']} style={styles.buttonGradient}>
                                <Text style={styles.buttonText}>Login</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Register Link */}
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.link}>Don't have an account? Register</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}

/* ────────────────── STYLES ────────────────── */
const styles = StyleSheet.create({
    container: { flex: 1 },
    logoWrapper: { alignItems: 'center', marginTop: height * 0.08, marginBottom: 20 },
    logo: { width: 300, height: 300 },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 30,
        padding: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 15,
    },
    title: {
        fontSize: 28,
        fontFamily: 'Inter_700Bold',
        textAlign: 'center',
        marginBottom: 25,
        color: '#e91e63',
    },

    /* ---- INPUT WRAPPER (default & focused) ---- */
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 12,
        paddingHorizontal: 15,
        marginBottom: 12,
        backgroundColor: '#fafafa',
    },
    inputWrapperFocused: {
        borderColor: '#a46946ff',   // <-- soft-blue on focus
        backgroundColor: '#fff',
    },

    icon: { marginRight: 10 },
    input: {
        flex: 1,
        paddingVertical: 15,
        fontFamily: 'Inter_400Regular',
        fontSize: 16,
    },
    error: { color: '#e74c3c', fontSize: 13, marginBottom: 8, marginLeft: 5 },

    button: { marginTop: 10, borderRadius: 12, overflow: 'hidden' },
    buttonGradient: { padding: 16, alignItems: 'center' },
    buttonText: { color: '#010101ff', fontFamily: 'Inter_700Bold', fontSize: 16 },

    link: { color: '#e91e63', textAlign: 'center', marginTop: 18, fontFamily: 'Inter_400Regular' },
});