/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Profile from '../components/Profile/Profile';
import {useIsFocused} from '@react-navigation/core';

const ProfileFragment = () => {
  const isFocused = useIsFocused();
  const Stack = createNativeStackNavigator();
  return (
    isFocused && (
      <Stack.Navigator
        initialRouteName="Profile"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    )
  );
};

export default ProfileFragment;
