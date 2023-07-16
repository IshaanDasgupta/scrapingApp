/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import tempLogo from '../../../static/tempLogo.png';
import tempBg from '../../../static/tempBg.png';

function CarosuelCard({data}) {
  return (
    <View style={styles.card}>
      <View style={styles.grow}>
        <View style={styles.bookmark}></View>
      </View>
      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.title}>Leetcode Weekly Contest</Text>
          <Text style={styles.description}>13 June 2023 - 0 days left</Text>
        </View>
        <View>
          <Image source={tempLogo} style={styles.icon}></Image>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    height: 250,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#2f1f60',
    flex: 1,
  },
  grow: {
    position: 'relative',
    flex: 1,
  },
  bookmark: {
    position: 'absolute',
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 12,
    color: '#000',
  },
  description: {
    fontSize: 8,
    color: '#cbcbcb',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default CarosuelCard;
