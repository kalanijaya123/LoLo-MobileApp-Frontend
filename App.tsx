// App.tsx
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { loadFavourites } from './src/redux/slices/postsSlice';
import { loadComments } from './src/redux/slices/commentsSlice';

const Stack = createNativeStackNavigator();

function Root() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const favs = await AsyncStorage.getItem('favourites');
      if (favs) {
        dispatch(loadFavourites(JSON.parse(favs)));
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('comments');
      if (saved) {
        dispatch(loadComments(JSON.parse(saved)));
      }
    })();
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Main" component={AppNavigator} />
      {/* Details is registered here at the root stack so it's accessible via
          navigation.navigate('Details') without occupying space in the tab bar. */}
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Root />
      </NavigationContainer>
    </Provider>
  );
}
