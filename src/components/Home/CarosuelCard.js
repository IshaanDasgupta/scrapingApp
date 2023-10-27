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
import {API} from 'aws-amplify';
import {listBookmarksExcludingEvent} from '../../graphql/queries';
import {addBookmark, deleteBookmark} from '../../graphql/mutations';
import GFGIcon from '../../../static/GFGIcon.png';
import LeetcodeIcon from '../../../static/LeetcodeIcon.png';
import CodeChefIcon from '../../../static/CodeChefIcon.png';
import CodeForcesIcon from '../../../static/CodeForcesIcon.png';
import FavIcon from '../../../static/FavIcon.png';
import MarkedFavIcon from '../../../static/MarkedFavIcon.png';

function CarosuelCard(props) {
  const getIcon = {
    gfg: GFGIcon,
    leetcode: LeetcodeIcon,
    codeChef: CodeChefIcon,
    codeForces: CodeForcesIcon,
  };

  const {eventData, navigation} = props;
  const [bookmarked, setBookmarked] = useState(undefined);
  const [bookmark, setBookmark] = useState({});

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        const variables = {
          filter: {eventName: {eq: eventData.name}},
        };
        const bookmarkData = await API.graphql({
          query: listBookmarksExcludingEvent,
          variables: variables,
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        if (bookmarkData.data.listBookmarks.items.length === 0) {
          setBookmarked(false);
        } else {
          setBookmarked(true);
          setBookmark(bookmarkData.data.listBookmarks.items[0]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookmark();
  }, [eventData]);

  const handlePress = () => {
    navigation.navigate('Event', {eventID: eventData.id, origin: 'Home'});
  };

  const addBookmarkFucntion = async () => {
    try {
      await API.graphql({
        query: addBookmark,
        variables: {
          input: {
            eventID: eventData.id,
            eventName: eventData.name,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
      setBookmarked(true);
    } catch (err) {
      console.log(err);
    }
  };

  const removeBookmark = () => {
    try {
      API.graphql({
        query: deleteBookmark,
        variables: {
          input: {
            id: bookmark.id,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
      setBookmarked(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookmark = () => {
    if (bookmarked === false) {
      addBookmarkFucntion();
    } else {
      removeBookmark();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.grow}>
          <TouchableWithoutFeedback onPress={handleBookmark}>
            <View style={styles.bookmark}>
              {bookmarked === true ? (
                <Image source={MarkedFavIcon} style={styles.bookmarkIcon} />
              ) : (
                <Image source={FavIcon} style={styles.bookmarkIcon} />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.content}>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{eventData.name}</Text>
            <Text style={styles.description}>
              {new Date(eventData.date).toDateString().substring(4)} -{' '}
              {Math.ceil(
                Math.abs(
                  (new Date(eventData.date) - new Date()) /
                    (24 * 60 * 60 * 1000),
                ),
              )}{' '}
              days left
            </Text>
          </View>
          <Image
            source={getIcon[eventData.eventPlatform]}
            style={styles.icon}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkIcon: {
    width: 18,
    height: 18,
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
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 12,
    color: '#000',
  },
  description: {
    fontSize: 10,
    color: '#9B9999',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default CarosuelCard;
