/* eslint-disable prettier/prettier */
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
  View,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import tempLogo from '../../../static/tempLogo.png';
import {API} from 'aws-amplify';
import {deleteBookmark} from '../../graphql/mutations';

function Card(props) {
  const {data, bookmarks, setBookmarks} = props;
  console.log(data);

  const removeBookmark = () => {
    try {
      API.graphql({
        query: deleteBookmark,
        variables: {
          input: {
            id: data.id,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookmark = () => {
    const otherBookmarks = bookmarks.filter(
      bookmark => bookmark.id !== data.id,
    );
    setBookmarks(otherBookmarks);
    removeBookmark();
  };

  const cardWidth = (Dimensions.get('window').width - 60) / 2;
  return (
    <View style={{...styles.card, width: cardWidth}}>
      <View style={styles.bookmarkContainer}>
        <TouchableWithoutFeedback onPress={handleBookmark}>
          <View>
            <Text style={styles.bookmarkIcon}>O</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{data.event.name}</Text>
        <Text>{data.event.description}</Text>
      </View>
      <Image source={tempLogo} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#537705',
  },
  bookmarkContainer: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    top: 20,
    right: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  name: {
    fontSize: 16,
    color: '#fff',
  },
  time: {
    fontSize: 12,
    color: '#fff',
    flex: 1,
  },
  timeLeft: {
    fontSize: 12,
    color: '#fff',
  },
  image: {
    width: 80,
    height: 80,
  },
});

export default Card;
