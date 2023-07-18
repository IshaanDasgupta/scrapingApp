/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Event from '../components/Event/Event';
import Todo from '../components/Todo/Todo';

const TodosFragment = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Todo"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Todo" component={Todo} />
      <Stack.Screen name="Event" component={Event} />
    </Stack.Navigator>
  );
};

export default TodosFragment;
