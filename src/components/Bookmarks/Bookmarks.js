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
  ScrollView,
  TextInput,
} from 'react-native';
import Card from './Card';
import {API} from 'aws-amplify';

import searchIcon from '../../../static/SearchIcon.png';
import {
  listBookmarksWithOnlyEvent,
  searchBookmarksForOnlyEvents,
} from '../../graphql/queries';

function Bookmarks({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [searchedBookmarks, setSearchedBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await API.graphql({
          query: listBookmarksWithOnlyEvent,
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        setBookmarks(
          res.data.listBookmarks.items.sort(
            (a, b) => new Date(a.event.date) - new Date(b.event.date),
          ),
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookmarks();
  }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await API.graphql({
          query: searchBookmarksForOnlyEvents,
          variables: {
            filter: {
              eventName: {
                matchPhrasePrefix: searchText,
              },
            },
          },
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        setSearchedBookmarks(
          res.data.searchBookmarks.items.sort(
            (a, b) => new Date(a.event.date) - new Date(b.event.date),
          ),
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookmarks();
  }, [searchText]);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Type to search something"
          />
          <Image source={searchIcon} style={styles.searchIcon} />
        </View>
        <Text style={styles.heading}>Your Bookmarks</Text>
        <View style={styles.cardsFlex}>
          {searchText.length === 0
            ? bookmarks.map((bookmark, index) => {
                return index % 2 === 1 ? (
                  <></>
                ) : (
                  <View style={styles.cardsRow}>
                    <Card
                      data={bookmarks[index]}
                      key={index}
                      bookmarks={bookmarks}
                      setBookmarks={setBookmarks}
                      navigation={navigation}
                    />
                    {index + 1 < bookmarks.length && (
                      <Card
                        data={bookmarks[index + 1]}
                        key={index + 1}
                        bookmarks={bookmarks}
                        setBookmarks={setBookmarks}
                        navigation={navigation}
                      />
                    )}
                  </View>
                );
              })
            : searchedBookmarks.map((bookmark, index) => {
                return index % 2 === 1 ? (
                  <></>
                ) : (
                  <View style={styles.cardsRow}>
                    <Card
                      data={bookmarks[index]}
                      key={index}
                      bookmarks={bookmarks}
                      setBookmarks={setBookmarks}
                      navigation={navigation}
                    />
                    {index + 1 < bookmarks.length && (
                      <Card
                        data={bookmarks[index + 1]}
                        key={index + 1}
                        bookmarks={bookmarks}
                        setBookmarks={setBookmarks}
                        navigation={navigation}
                      />
                    )}
                  </View>
                );
              })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: '#f5f7fb',
  },
  searchContainer: {
    position: 'relative',
  },
  searchBar: {
    fontSize: 14,
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  searchIcon: {
    position: 'absolute',
    width: 24,
    height: 24,
    right: 15,
    top: 12,
  },
  heading: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
  cardsFlex: {
    flexDirection: 'column',
    gap: 20,
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 20,
  },
});

export default Bookmarks;
