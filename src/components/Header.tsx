import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Switch,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { toggleTheme } from '../redux/slices/themeSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
    const user = useSelector((state: RootState) => state.auth.user);
    const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
    const dispatch = useDispatch();

    const handleToggle = () => {
        dispatch(toggleTheme());
    };

    return (
        <LinearGradient
            colors={isDarkMode ? ['#5a5757ff', '#333'] : ['#e91e63', '#ff6b6b']}
            style={styles.container}
        >
            <View style={styles.logoContainer}>
                <Image
                    source={require('../../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            {user && (
                <View style={styles.rightContainer}>
                    <Text style={styles.username}>Hi, {user.username}</Text>

                    <View style={styles.toggleContainer}>
                        <Ionicons
                            name={isDarkMode ? 'moon' : 'sunny'}
                            size={20}
                            color={isDarkMode ? '#fff' : '#ffeb3b'}
                            style={styles.icon}
                        />
                        <Switch
                            value={isDarkMode}
                            onValueChange={handleToggle}
                            thumbColor={isDarkMode ? '#fff' : '#ff6b6b'}
                            trackColor={{ false: '#f8bfbf', true: '#555353ff' }}
                        />
                    </View>
                </View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        elevation: 4,
    },
    logoContainer: {
        paddingLeft: 8,
    },
    logo: {
        width: 200,
        height: 80,
    },
    rightContainer: {
        paddingRight: 20,
        alignItems: 'center',
    },
    username: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 4,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 6,
    },
});
