/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {API} from 'aws-amplify';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  getEvent,
  searchBookmarks,
  searchBookmarksForID,
} from '../../graphql/queries';
import {createBookmark, deleteBookmark} from '../../graphql/mutations';

function Event(props) {
  const {navigation, route} = props;
  const {eventID, origin} = route.params;

  const [eventData, setEventData] = useState({});
  const [bookmarkID, setBookmarkID] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.graphql({
          query: getEvent,
          variables: {
            id: eventID,
          },
        });
        setEventData(res.data.getEvent);
        // console.log(res.data.eventData);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchBookmark = async () => {
      try {
        const res = await API.graphql({
          query: searchBookmarksForID,
          variables: {
            filter: {
              eventID: {
                eq: eventID,
              },
            },
          },
        });
        if (res.data.searchBookmarks.items.length !== 0) {
          setBookmarkID(res.data.searchBookmarks.items[0].id);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvent();
    fetchBookmark();
  }, [eventID]);

  const handelBookmark = async () => {
    if (bookmarkID.length === 0) {
      try {
        console.log(eventID);
        console.log('creating', eventID, eventData.name);
        const res = await API.graphql({
          query: createBookmark,
          variables: {
            input: {
              eventID: eventID,
              eventName: eventData.name,
            },
          },
        });
        setBookmarkID(res.data.createBookmark.id);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await API.graphql({
          query: deleteBookmark,
          variables: {
            input: {
              id: bookmarkID,
            },
          },
        });
        setBookmarkID('');
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handelBookmark}>
        <View style={styles.bookmarkContainer}>
          {bookmarkID.length === 0 ? (
            <Text style={styles.bookmarkIcon}>B</Text>
          ) : (
            <Text style={styles.bookmarkIcon}>O</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => navigation.navigate(origin)}>
        <View style={styles.backContainer}>
          <Text style={styles.backIcon}>-</Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bannerContainer}></View>
      <View style={styles.mainContent}>
        <Text style={styles.name}>{eventData.name}</Text>
        <View style={styles.flex}>
          <View style={styles.infoFlex}>
            <Text style={styles.infoIcon}>_</Text>
            <Text style={styles.infoText}>30 April 2023</Text>
          </View>
          <View style={styles.infoFlex}>
            <Text style={styles.infoIcon}>_</Text>
            <Text style={styles.infoText}>8 PM</Text>
          </View>
        </View>
        <View style={styles.timeLeftFlex}>
          <Text style={styles.infoIcon}>_</Text>
          <Text style={styles.infoText}>3 days left</Text>
        </View>
        <Text style={styles.heading}>Your Todo's for this Event</Text>
        <View style={styles.todosContainer}></View>
        <TouchableWithoutFeedback>
          <View style={styles.vistButton}>
            <Text style={styles.vistText}>Vist this in Web</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  bookmarkContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    top: 40,
    right: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backContainer: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    top: 40,
    left: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bannerContainer: {
    height: '30%',
    width: '100%',
    backgroundColor: '#2f1f60',
  },
  mainContent: {
    backgroundColor: '#fff',
    // minHeight: '100%',
    flex: 1,
    marginBottom: -30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    position: 'relative',
    top: -30,
    padding: 30,
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    color: '#000',
    marginBottom: 15,
  },
  flex: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 10,
  },
  infoFlex: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  timeLeftFlex: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  infoIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#656565',
    color: '#656565',
    borderRadius: 7,
  },
  infoText: {
    fontSize: 12,
    color: '#656565',
  },
  heading: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
  todosContainer: {
    flex: 1,
  },
  vistButton: {
    width: '100%',
    backgroundColor: '#249781',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  vistText: {
    color: '#fff',
  },
});

export default Event;
