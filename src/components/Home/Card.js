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
  Pressable,
  TouchableNativeFeedback,
} from 'react-native';
import FavIcon from '../../../static/FavIcon.png';
import MarkedFavIcon from '../../../static/MarkedFavIcon.png';
import {API} from 'aws-amplify';
import {addBookmark, deleteBookmark} from '../../graphql/mutations';

function Card(props) {
  const {data, bookmarks, setBookmarks, navigation} = props;

  const [bookmarked, setBookmarked] = useState(undefined);
  const [buffering, setBuffering] = useState(false);

  useEffect(() => {
    const temp = bookmarks.find(bookmark => bookmark.eventID === data.id);
    if (temp !== undefined) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }
  }, [bookmarks, data.id]);

  const addBookmarkFucntion = async () => {
    try {
      const temp = await API.graphql({
        query: addBookmark,
        variables: {
          input: {
            eventID: data.id,
            eventName: data.name,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
      setBookmarks(bookmarks => [
        ...bookmarks,
        {
          id: temp.data.createBookmark.id,
          eventID: temp.data.createBookmark.eventID,
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const removeBookmark = () => {
    try {
      const temp = bookmarks.filter(bookmark => bookmark.eventID === data.id);
      API.graphql({
        query: deleteBookmark,
        variables: {
          input: {
            id: temp[0].id,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookmark = () => {
    setBuffering(true);
    if (bookmarked === false) {
      // setBookmarks([...bookmarks, data]);
      addBookmarkFucntion();
    } else {
      const otherBookmarks = bookmarks.filter(
        bookmark => bookmark.eventID !== data.id,
      );
      setBookmarks(otherBookmarks);
      removeBookmark();
    }
    setBuffering(false);
  };

  const handlePress = () => {
    navigation.navigate('Event', {eventID: data.id, origin: 'Home'});
  };

  const BGColor = {
    leetcode: '#1C4980',
    unstop: '#1C4980',
    gfg: '#1C4980',
    codeForces: '#1C4980',
    codeChef: '#1C4980',
  };

  // const BGColor = {
  //   leetcode: '#F89F1B',
  //   unstop: '#1C4980',
  //   gfg: '#0F7D2A',
  //   codeForces: '#BA2026',
  //   codeChef: '#5B4538',
  // };

  const eventPlatform = {
    leetcode: 'Leetcode',
    unstop: 'Unstop',
    gfg: 'GFG',
    codeForces: 'Code Forces',
    codeChef: 'Code Chef',
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={handleBookmark}>
        <View style={styles.bookmarkContainer}>
          {bookmarked === false ? (
            <Image source={FavIcon} style={styles.bookmarkIcon} />
          ) : (
            <Image source={MarkedFavIcon} style={styles.bookmarkIcon} />
          )}
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View
          style={{
            ...styles.card,
            backgroundColor: BGColor[data.eventPlatform],
          }}>
          <View style={styles.daysLeftContainer}>
            <Text style={styles.daysLeftHeading}>
              {Math.ceil(
                Math.abs(
                  (new Date(data.date) - new Date()) / (24 * 60 * 60 * 1000),
                ),
              )}
            </Text>
            <Text style={styles.daysLeftText}>Days Left</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.time}>
              {new Date(data.date).toDateString().substring(4)} {'     '}
              {data.time}
            </Text>
            <Text style={styles.platform}>
              {eventPlatform[data.eventPlatform]}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
    flex: 1,
  },
  daysLeftContainer: {
    width: 80,
    height: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysLeftHeading: {
    fontSize: 30,
    margin: 0,
    padding: 0,
  },
  daysLeftText: {
    margin: 0,
    padding: 0,
    fontSize: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    marginRight: 40,
  },
  bookmarkContainer: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    top: 10,
    right: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bookmarkIcon: {
    width: 18,
    height: 18,
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
  platform: {
    fontSize: 12,
    color: '#fff',
    alignSelf: 'baseline',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default Card;
