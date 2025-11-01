// src/components/Header.tsx
import React, { useRef } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Easing,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { LinearGradient } from 'expo-linear-gradient';

export default function Header() {
    const user = useSelector((state: RootState) => state.auth.user);

    // Wave animation
    const waveAnim = useRef(new Animated.Value(0)).current;

    const startWave = () => {
        waveAnim.setValue(0);
        Animated.timing(waveAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start(() => waveAnim.setValue(0));
    };

    const waveScale = waveAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.5, 1],
    });

    const waveOpacity = waveAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.7, 0],
    });

    return (
        <LinearGradient colors={['#e91e63', '#ff6b6b']} style={styles.container}>
            {/* Logo – 8px from left edge */}
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {/* Username + Wave (Right-aligned) */}
            {user && (
                <TouchableOpacity onPress={startWave} activeOpacity={0.8} style={styles.usernameTouch}>
                    <View style={styles.usernameWrapper}>
                        <Text style={styles.username}>Hi, {user.username}</Text>

                        {/* Wave Ring */}
                        <Animated.View
                            style={[
                                styles.waveRing,
                                {
                                    transform: [{ scale: waveScale }],
                                    opacity: waveOpacity,
                                },
                            ]}
                        />
                    </View>
                </TouchableOpacity>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 1,
        paddingHorizontal: 0, // Remove default padding
        elevation: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },

    // Logo: 8px from left edge
    logoContainer: {
        paddingLeft: 1, // ← 8px from left

    },
    logo: {

        width: 200,
        height: 100,
    },

    // Username on the far right
    usernameTouch: {
        paddingRight: 20, // Keep some space from right edge
    },
    usernameWrapper: {
        position: 'relative',
        padding: 8,
    },
    username: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'Inter_700Bold',
    },
    waveRing: {
        position: 'absolute',
        top: -12,
        left: -12,
        right: -12,
        bottom: -12,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
        opacity: 0,
    },
});