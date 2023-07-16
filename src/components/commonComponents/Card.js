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
} from 'react-native';
import tempLogo from '../../../static/tempLogo.png';
import {API} from 'aws-amplify';
import {addBookmark, deleteBookmark} from '../../graphql/mutations';

function Card(props) {
  const {data, bookmarks, setBookmarks} = props;

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

  return (
    <View style={styles.card}>
      <View style={styles.bookmarkContainer}>
        <TouchableWithoutFeedback onPress={handleBookmark}>
          <View>
            {bookmarked === false ? (
              <Text style={styles.bookmarkIcon}>B</Text>
            ) : (
              <Text style={styles.bookmarkIcon}>O</Text>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.time}>{data.time}</Text>
        <Text style={styles.timeLeft}>3 Days Left</Text>
      </View>
      <Image source={tempLogo} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#537705',
    position: 'relative',
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
    width: 100,
    height: 100,
  },
});

export default Card;
