/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../components/Home/Home';
import Event from '../components/Event/Event';
import {useIsFocused} from '@react-navigation/core';

const HomeFragment = () => {
  const isFocused = useIsFocused();
  const Stack = createNativeStackNavigator();
  return (
    isFocused && (
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Event" component={Event} />
      </Stack.Navigator>
    )
  );
};

export default HomeFragment;
