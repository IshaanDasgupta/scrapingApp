/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {API, graphqlOperation} from 'aws-amplify';
import {
  listBookmarksExcludingEvent,
  listEvents,
  searchEventsForOnlyEvent,
} from '../../graphql/queries';
import SearchBar from './SearchBar';
import Catagories from './Categories';
import CustomCarousel from './CustomCarousel';
import Card from './Card';

function Home({navigation}) {
  const [events, setEvents] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchedEvents, setSearchedEvents] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await API.graphql({
          query: listEvents,
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        setEvents(eventData.data.listEvents.items);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchBookmakrs = async () => {
      try {
        const bookmarkData = await API.graphql({
          query: listBookmarksExcludingEvent,
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        // console.log(eventData.data.listBookmarks.items);
        setBookmarks(bookmarkData.data.listBookmarks.items);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();
    fetchBookmakrs();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.graphql({
          query: searchEventsForOnlyEvent,
          variables: {
            filter: {
              name: {
                matchPhrasePrefix: searchText,
              },
            },
          },
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        setSearchedEvents(res.data.searchEvents.items);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();
  }, [searchText]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.background}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back &#128075;</Text>
            <Text style={styles.username}>Ishaan</Text>
          </View>
          <View style={styles.notificationContainer}></View>
        </View>
        <View style={styles.mainContent}>
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
          <Text style={styles.heading}>Category</Text>
          <Catagories />
          {searchText.length === 0 && (
            <View>
              <Text style={styles.heading}>Featured</Text>
              <CustomCarousel />
            </View>
          )}
          <Text style={styles.heading}>Recent Events</Text>
          <View style={styles.cardsFlex}>
            {searchText.length === 0
              ? events &&
                events.map(event => {
                  return (
                    <Card
                      data={event}
                      bookmarks={bookmarks}
                      setBookmarks={setBookmarks}
                      navigation={navigation}
                    />
                  );
                })
              : searchedEvents &&
                searchedEvents.map(event => {
                  return (
                    <Card
                      data={event}
                      bookmarks={bookmarks}
                      setBookmarks={setBookmarks}
                      navigation={navigation}
                    />
                  );
                })}
          </View>
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
  welcomeText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 0,
  },
  username: {
    fontSize: 24,
    color: '#fff',
  },
  notificationContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4cbfa9',
  },
  mainContent: {
    padding: 20,
    paddingBottom: 0,
    position: 'relative',
    top: -50,
  },
  heading: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
  cardsFlex: {
    flexDirection: 'column',
    gap: 20,
  },
});

export default Home;
