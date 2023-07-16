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
  TouchableWithoutFeedback,
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
  searchBookmarksOnlyForEvents,
} from '../../graphql/queries';

function Search({navigation}) {
  const [searchText, setSearchText] = useState('');
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await API.graphql({
          query: listBookmarksWithOnlyEvent,
          authMode: 'AMAZON_COGNITO_USER_POOLS',
        });
        setBookmarks(res.data.listBookmarks.items);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.scroll}>
        <ScrollView>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchBar}
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Type to search something"
            />
            <Image source={searchIcon} style={styles.searchIcon} />
          </View>
          <Text style={styles.heading}>Popular Catagories</Text>
          <View style={styles.cardsFlex}>
            {bookmarks.map((bookmark, index) => {
              return index % 2 === 1 ? (
                <></>
              ) : (
                <View style={styles.cardsRow}>
                  <Card
                    data={bookmarks[index]}
                    key={index}
                    bookmarks={bookmarks}
                    setBookmarks={setBookmarks}
                  />
                  {index + 1 < bookmarks.length && (
                    <Card
                      data={bookmarks[index + 1]}
                      key={index + 1}
                      bookmarks={bookmarks}
                      setBookmarks={setBookmarks}
                    />
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    padding: 20,
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
    fontSize: 18,
    color: '#262626',
    marginBottom: 20,
  },
  cardsFlex: {
    flexDirection: 'column',
    gap: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 20,
  },
});

export default Search;
