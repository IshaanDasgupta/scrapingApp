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

function Catagories(props) {
  const {filter, setFilter} = props;

  const setHackathon = () => {
    if (filter === 'hackathon') {
      setFilter('');
    } else {
      setFilter('hackathon');
    }
  };

  const setInternship = () => {
    if (filter === 'internship') {
      setFilter('');
    } else {
      setFilter('internship');
    }
  };

  const setContest = () => {
    if (filter === 'contest') {
      setFilter('');
    } else {
      setFilter('contest');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.scrollView}
        showsHorizontalScrollIndicator={false}>
        <TouchableWithoutFeedback onPress={setHackathon}>
          <View
            style={
              filter === 'hackathon'
                ? styles.selectedCardContainer
                : styles.cardContainer
            }>
            <Text style={styles.icon}>_</Text>
            <Text
              style={
                filter === 'hackathon' ? styles.selectedText : styles.text
              }>
              Hackathons
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={setInternship}>
          <View
            style={
              filter === 'internship'
                ? styles.selectedCardContainer
                : styles.cardContainer
            }>
            <Text style={styles.icon}>_</Text>
            <Text
              style={
                filter === 'internship' ? styles.selectedText : styles.text
              }>
              Internships
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={setContest}>
          <View
            style={
              filter === 'contest'
                ? styles.selectedCardContainer
                : styles.cardContainer
            }>
            <Text style={styles.icon}>_</Text>
            <Text
              style={filter === 'contest' ? styles.selectedText : styles.text}>
              Contests
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 20,
  },
  scrollView: {
    width: '100%',
  },
  cardContainer: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    gap: 5,
  },
  selectedCardContainer: {
    padding: 20,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#249781',
    color: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    gap: 5,
  },
  icon: {
    width: 18,
    height: 18,
  },
  text: {
    fontSize: 12,
  },
  selectedText: {
    fontSize: 12,
    color: '#fff',
  },
});

export default Catagories;
