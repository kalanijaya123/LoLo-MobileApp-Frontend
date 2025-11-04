// src/screens/Auth/RegisterScreen.tsx
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Animated,
    Easing,
    Dimensions,
    Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setCredentials } from '../../redux/slices/authSlice';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import ConfettiCannon from 'react-native-confetti-cannon';

const { height } = Dimensions.get('window');

type FormData = { username: string; email: string; password: string; confirm: string };

const schema = yup.object().shape({
    username: yup.string().min(3).required('Username is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(4).required('Password is required'),
    confirm: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm your password'),
});

export default function RegisterScreen({ navigation }: any) {
    const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
    const dispatch = useDispatch();
    const confettiRef = useRef<any>(null);
    const heartAnim = useRef(new Animated.Value(0)).current;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    useEffect(() => {
        startHeartRain();
    }, []);

    const startHeartRain = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(heartAnim, { toValue: 1, duration: 3000, easing: Easing.linear, useNativeDriver: true }),
                Animated.timing(heartAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
            ])
        ).start();
    };

    const onSubmit = async (data: FormData) => {
        const mockUser = {
            id: Math.floor(Math.random() * 100000),
            username: data.username,
            email: data.email,
        };

        const payload = { user: mockUser, token: 'mock-token-registered' };
        dispatch(setCredentials(payload));
        await AsyncStorage.setItem('auth', JSON.stringify(payload));
        confettiRef.current?.start();
        setTimeout(() => navigation.replace('Main'), 1500);
    };

    const hearts = Array.from({ length: 8 }).map((_, i) => (
        <Animated.View
            key={i}
            style={[
                styles.heart,
                {
                    left: `${15 + (i % 4) * 20}%`,
                    transform: [
                        {
                            translateY: heartAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-height * 0.8, height * 1.2],
                            }),
                        },
                        {
                            rotate: heartAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg'],
                            }),
                        },
                    ],
                    opacity: heartAnim.interpolate({
                        inputRange: [0, 0.1, 0.9, 1],
                        outputRange: [0, 1, 1, 0],
                    }),
                },
            ]}
        >
            <Feather name="heart" size={28} color="#e91e63" />
        </Animated.View>
    ));

    const content = (
        <LinearGradient
            colors={isDark ? ['#121212', '#1e1e1e'] : ['#ff6b6b', '#e91e63']}
            style={styles.container}
        >
            {/* Heart Rain */}
            <View style={styles.heartsContainer} pointerEvents="none">
                {hearts}
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.form}>
                <Animatable.View animation="fadeInDown" duration={600}>
                    {/* LOGO */}
                    <View style={styles.logoWrap}>
                        {isDark && <View style={styles.logoBackdrop} pointerEvents="none" />}
                        <Image
                            source={require('../../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={[styles.title, { color: '#fff' }]}>Join LoLo</Text>
                    <Text style={[styles.subtitle, { color: '#fff' }]}>Create your account</Text>
                </Animatable.View>

                <Animatable.View animation="fadeInUp" delay={300} duration={600} style={styles.inputContainer}>
                    <Controller
                        control={control}
                        name="username"
                        render={({ field }) => (
                            <View style={styles.inputWrapper}>
                                <Feather name="user" size={20} color="#fff" style={styles.icon} />
                                <TextInput
                                    style={[styles.input, { color: '#fff' }]}
                                    placeholder="Username"
                                    placeholderTextColor="#ccc"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            </View>
                        )}
                    />
                    {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <View style={styles.inputWrapper}>
                                <Feather name="mail" size={20} color="#fff" style={styles.icon} />
                                <TextInput
                                    style={[styles.input, { color: '#fff' }]}
                                    placeholder="Email"
                                    placeholderTextColor="#ccc"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            </View>
                        )}
                    />
                    {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <View style={styles.inputWrapper}>
                                <Feather name="lock" size={20} color="#fff" style={styles.icon} />
                                <TextInput
                                    style={[styles.input, { color: '#fff' }]}
                                    placeholder="Password"
                                    placeholderTextColor="#ccc"
                                    secureTextEntry
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            </View>
                        )}
                    />
                    {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

                    <Controller
                        control={control}
                        name="confirm"
                        render={({ field }) => (
                            <View style={styles.inputWrapper}>
                                <Feather name="lock" size={20} color="#fff" style={styles.icon} />
                                <TextInput
                                    style={[styles.input, { color: '#fff' }]}
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#ccc"
                                    secureTextEntry
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            </View>
                        )}
                    />
                    {errors.confirm && <Text style={styles.error}>{errors.confirm.message}</Text>}
                </Animatable.View>

                <Animatable.View animation="bounceIn" delay={600}>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                        <LinearGradient colors={['#fff', '#f0f0f0']} style={styles.buttonGradient}>
                            <Text style={styles.buttonText}>Register</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Animatable.View>

                <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}>Already have an account? </Text>
                    <Text style={[styles.link, { color: '#fff', fontWeight: 'bold' }]}>Login</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

            <ConfettiCannon count={80} origin={{ x: -10, y: 0 }} ref={confettiRef} />
        </LinearGradient>
    );

    if (Platform.OS === 'web') return content;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            {content}
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    heartsContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    heart: {
        position: 'absolute',
        top: -50,
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 16,
    },
    logoWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
        marginBottom: 16,
    },
    logoBackdrop: {
        position: 'absolute',
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: 'rgba(255,255,255,0.06)',
        top: 0,
        alignSelf: 'center',
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        opacity: 0.9,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 14,
    },
    error: {
        color: '#ff6b6b',
        fontSize: 12,
        marginLeft: 16,
        marginBottom: 8,
    },
    button: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonGradient: {
        padding: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#e91e63',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    link: {
        color: '#fff',
        fontSize: 15,
    },
});