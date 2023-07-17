/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, TextInput} from 'react-native';

import searchIcon from '../../../static/SearchIcon.png';

function SearchBar(props) {
  const {searchText, setSearchText} = props;
  return (
    <TextInput
      style={styles.searchBar}
      value={searchText}
      onChangeText={setSearchText}
      placeholder="Type to search something"
    />
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
    color: '#cbcbcb',
  },
  searchIcon: {
    position: 'absolute',
    width: 24,
    height: 24,
    right: 15,
    top: 12,
  },
});

export default SearchBar;
