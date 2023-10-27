/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {Image, StyleSheet, TextInput, View} from 'react-native';

import searchIcon from '../../../static/SearchIcon.png';

function SearchBar(props) {
  const {searchText, setSearchText} = props;
  return (
    <View>
      <TextInput
        style={styles.searchBar}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Type to search something"
      />
      <Image source={searchIcon} style={styles.searchIcon} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    fontSize: 12,
    padding: 18,
    paddingLeft: 20,
    marginBottom: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    color: '#000',
  },
  searchIcon: {
    position: 'absolute',
    width: 24,
    height: 24,
    right: 20,
    top: 18,
  },
});

export default SearchBar;
