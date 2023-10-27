/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import {API} from 'aws-amplify';
import {useAuthenticator} from '@aws-amplify/ui-react-native';
import {
  listBookmarksExcludingEvent,
  listEvents,
  searchEventsForOnlyEvent,
} from '../../graphql/queries';
import SearchBar from './SearchBar';
import Catagories from './Categories';
import CustomCarousel from './CustomCarousel';
import Card from './Card';
import NotificationIcon from '../../../static/NotificationIcon.png';

const userSelector = context => [context.user];

function Home({navigation}) {
  const {user} = useAuthenticator(userSelector);

  const [events, setEvents] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchedEvents, setSearchedEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await API.graphql({
          query: listEvents,
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        setEvents(
          eventData.data.listEvents.items
            .filter(data => new Date(data.date) >= new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date)),
        );
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

  useEffect(() => {
    if (searchText.length === 0) {
      setFilteredEvents(events.filter(event => event.eventType === filter));
    } else {
      setFilteredEvents(
        searchedEvents.filter(event => event.eventType === filter),
      );
    }
  }, [filter, events, searchedEvents, searchText.length]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.background}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back &#128075;</Text>
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <View style={styles.notificationContainer}>
            <Image source={NotificationIcon} style={styles.notificationIcon} />
          </View>
        </View>
        <View style={styles.mainContent}>
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
          <Text style={styles.heading}>Category</Text>
          <Catagories filter={filter} setFilter={setFilter} />
          {searchText.length === 0 && (
            <View>
              <Text style={styles.heading}>Featured</Text>
              <CustomCarousel navigation={navigation} />
            </View>
          )}
          <Text style={styles.heading}>Upcomming Events</Text>
          <View style={styles.cardsFlex}>
            {searchText.length === 0
              ? filter.length === 0
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
                : filteredEvents &&
                  filteredEvents.map(event => {
                    return (
                      <Card
                        data={event}
                        bookmarks={bookmarks}
                        setBookmarks={setBookmarks}
                        navigation={navigation}
                      />
                    );
                  })
              : filter.length === 0
              ? searchedEvents &&
                searchedEvents.map(event => {
                  return (
                    <Card
                      data={event}
                      bookmarks={bookmarks}
                      setBookmarks={setBookmarks}
                      navigation={navigation}
                    />
                  );
                })
              : filteredEvents &&
                filteredEvents.map(event => {
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 30,
    height: 30,
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
