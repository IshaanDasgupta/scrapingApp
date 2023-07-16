/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';

function Catagories() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal style={styles.scrollView}>
        <View style={styles.cardContainer}>
          <Text style={styles.icon}>_</Text>
          <Text style={styles.text}>Hackathons</Text>
        </View>
        <View style={styles.cardContainer}>
          <Text style={styles.icon}>_</Text>
          <Text style={styles.text}>Internships</Text>
        </View>
        <View style={styles.cardContainer}>
          <Text style={styles.icon}>_</Text>
          <Text style={styles.text}>Contests</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
  },
  cardContainer: {
    width: 120,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    gap: 5,
  },
  icon: {
    width: 18,
    height: 18,
  },
  text: {
    fontSize: 12,
    // fontWeight: 800,
  },
});

export default Catagories;
