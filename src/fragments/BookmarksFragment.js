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

const BookmarksFragment = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Bookmarks"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Bookmarks" component={Bookmarks} />
      <Stack.Screen name="Event" component={Event} />
    </Stack.Navigator>
  );
};

export default BookmarksFragment;
