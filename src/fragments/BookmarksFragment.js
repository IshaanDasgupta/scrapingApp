/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Bookmarks from '../components/Bookmarks/Bookmarks';
import Event from '../components/Event/Event';
import {useIsFocused} from '@react-navigation/core';

const BookmarksFragment = () => {
  const isFocused = useIsFocused();
  const Stack = createNativeStackNavigator();
  return (
    isFocused && (
      <Stack.Navigator
        initialRouteName="Bookmarks"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Bookmarks" component={Bookmarks} />
        <Stack.Screen name="Event" component={Event} />
      </Stack.Navigator>
    )
  );
};

export default BookmarksFragment;
