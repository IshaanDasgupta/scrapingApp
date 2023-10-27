/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, Text, View, ScrollView, Pressable} from 'react-native';
import {useAuthenticator} from '@aws-amplify/ui-react-native';

const userSelector = context => [context.user];

function Profile({navigation}) {
  const {user, signOut} = useAuthenticator(userSelector);
  const options = [
    {
      title: 'Change Profile Data',
      icon: '_',
      function: '_',
    },
    {
      title: 'Change Password',
      icon: '_',
      function: '_',
    },
    {
      title: 'Dark Mode',
      icon: '_',
      function: '_',
    },
    {
      title: 'Logout',
      icon: '_',
      function: '_',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.background} />
        <View style={styles.mainContent}>
          <View style={styles.profileCard}>
            <View style={styles.profilePicContainer}></View>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.email}>{user.attributes.email}</Text>
          </View>

          {options.map((option, index) => {
            return option.title === 'Logout' ? (
              <Pressable
                style={styles.optionCard}
                key={index}
                onPress={signOut}>
                <View style={styles.info}>
                  <Text style={styles.icon}>{option.icon}</Text>
                  <Text style={styles.text}>{option.title}</Text>
                </View>
                <Text style={styles.navigationIcon}>_</Text>
              </Pressable>
            ) : (
              <View style={styles.optionCard} key={index}>
                <View style={styles.info}>
                  <Text style={styles.icon}>{option.icon}</Text>
                  <Text style={styles.text}>{option.title}</Text>
                </View>
                <Text style={styles.navigationIcon}>_</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  background: {
    width: '100%',
    height: 200,
    backgroundColor: '#249781',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainContent: {
    padding: 20,
    paddingBottom: 0,
    position: 'relative',
    top: -100,
  },
  profileCard: {
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  profilePicContainer: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 45,
    top: -45,
  },
  username: {
    fontSize: 24,
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#000',
    marginBottom: 0,
  },
  optionCard: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 10,
  },
  info: {
    flexDirection: 'row',
    gap: 5,
  },
  icon: {
    width: 12,
    height: 12,
  },
  text: {
    fontSize: 12,
  },
  navigationIcon: {
    width: 12,
    height: 12,
  },
});

export default Profile;
