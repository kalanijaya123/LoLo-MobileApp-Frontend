// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DetailsScreen from '../screens/DetailsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#e91e63',
                tabBarInactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Favourites"
                component={FavouritesScreen}
                options={{
                    tabBarIcon: ({ color }) => <Feather name="heart" size={24} color={color} />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Details"
                component={DetailsScreen}
                options={{
                    tabBarButton: () => null, // Hide from tabs
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
}