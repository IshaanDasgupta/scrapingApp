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
  const {data, bookmarks, setBookmarks, navigation} = props;

  const cardWidth = (Dimensions.get('window').width - 60) / 2;

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

  const handlePress = () => {
    navigation.navigate('Event', {eventID: data.eventID, origin: 'Bookmarks'});
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={handleBookmark}>
        <View style={styles.bookmarkContainer}>
          <View>
            <Text style={styles.bookmarkIcon}>O</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={{width: cardWidth}}>
          <View style={styles.banner}>
            <Image source={tempLogo} style={styles.image} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{data.event.name}</Text>
            <View style={styles.flex}>
              <View style={styles.infoFlex}>
                <Text style={styles.infoIcon}></Text>
                <Text style={styles.infoText}>30 April 2023</Text>
              </View>
              <View style={styles.infoFlex}>
                <Text style={styles.infoIcon}></Text>
                <Text style={styles.infoText}>3 days left</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  bookmarkContainer: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    top: 15,
    right: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  banner: {
    width: '100%',
    backgroundColor: '#ff4260',
    height: 150,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    position: 'relative',
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 15,
  },
  name: {
    fontSize: 14,
    marginBottom: 10,
    color: '#000',
  },
  flex: {
    flexDirection: 'column',
    gap: 5,
  },
  infoFlex: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  infoIcon: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  infoText: {
    fontSize: 12,
  },
  image: {
    width: 80,
    height: 80,
    position: 'absolute',
    bottom: 15,
    left: 15,
    zIndex: 1,
  },
});

export default Card;
