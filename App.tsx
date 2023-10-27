/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeFragment from './src/fragments/HomeFragment';
import BookmarksFragment from './src/fragments/BookmarksFragment';
import TodosFragment from './src/fragments/TodosFragment';
import ProfileFragment from './src/fragments/ProfileFragment';
import FragmentIcon from './src/components/commonComponents/FragmentIcon';
import {withAuthenticator} from '@aws-amplify/ui-react-native';
import {Amplify} from 'aws-amplify';
import awsExports from './src/aws-exports';

Amplify.configure(awsExports);

function App(): JSX.Element {
  const Tab = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="HomeFragment"
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({focused, color, size}) => {
            return (
              <FragmentIcon
                routeName={route.name}
                focused={focused}
                color={color}
                size={size}
              />
            );
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}>
        <Tab.Screen name="HomeFragment" component={HomeFragment} />
        <Tab.Screen name="BookmarkFragment" component={BookmarksFragment} />
        <Tab.Screen name="TodosFragment" component={TodosFragment} />
        <Tab.Screen name="ProfileFragment" component={ProfileFragment} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default withAuthenticator(App);
