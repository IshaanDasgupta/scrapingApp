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
import Card from '../commonComponents/Card';

function Home({navigation}) {
  const [events, setEvents] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // const fetchEvents = async () => {
    //   try {
    //     const eventData = await API.graphql({
    //       query: listEvents,
    //       authMode: 'AMAZON_COGNITO_USER_POOLS',
    //     });
    //     setEvents(eventData.data.listEvents.items);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    const fetchBookmakrs = async () => {
      try {
        const eventData = await API.graphql({
          query: listBookmarksExcludingEvent,
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        // console.log(eventData.data.listBookmarks.items);
        setBookmarks(eventData.data.listBookmarks.items);
      } catch (err) {
        console.log(err);
      }
    };

    // fetchEvents();
    fetchBookmakrs();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log(searchText);
        let searchStr = '*';
        for (let i = 0; i < searchText.length; i++) {
          searchStr += searchText[i];
          searchStr += '*';
        }
        console.log(searchStr);
        const res = await API.graphql({
          query: searchEventsForOnlyEvent,
          variables: {
            filter: {
              name: {
                wildcard: searchStr,
              },
            },
          },
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        setEvents(res.data.searchEvents.items);
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvents();
  }, [searchText]);

  const data = {
    name: 'dummy name',
    time: '13/07',
  };

  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
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
              {events &&
                events.map(event => {
                  return (
                    <Card
                      data={event}
                      bookmarks={bookmarks}
                      setBookmarks={setBookmarks}
                    />
                  );
                })}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  scroll: {
    flex: 1,
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
    fontSize: 12,
    color: '#262626',
    marginBottom: 20,
  },
  cardsFlex: {
    flexDirection: 'column',
    gap: 20,
  },
});

export default Home;
