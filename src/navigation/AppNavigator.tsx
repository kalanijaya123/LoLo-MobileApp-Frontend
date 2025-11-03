// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import HomeScreen from '../screens/HomeScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailsScreen from '../screens/DetailsScreen';
import ChatScreen from '../screens/ChatScreen';
import Header from '../components/Header';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const isDark = useSelector((state: RootState) => state.theme.isDarkMode);
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: isDark ? '#ff6b6b' : '#e91e63',
                tabBarInactiveTintColor: isDark ? '#9e9e9e' : 'gray',
                tabBarStyle: { backgroundColor: isDark ? '#000' : '#fff' },
                header: () => <Header />, // ← Shows username in header
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
                }}
            />
            <Tab.Screen
                name="Favourites"
                component={FavouritesScreen}
                options={{
                    tabBarIcon: ({ color }) => <Feather name="heart" size={24} color={color} />,
                }}
            />

            {/* Details is intentionally omitted from the tab bar so it doesn't reserve space.
                It's registered at the root stack in App.tsx so you can still navigate to it via
                navigation.navigate('Details'). */}
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ color }) => <Feather name="message-circle" size={24} color={color} />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}