/* eslint-disable prettier/prettier */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {API} from 'aws-amplify';
import {deleteBookmark} from '../../graphql/mutations';
import MarkedFavIcon from '../../../static/MarkedFavIcon.png';
import DateIcon from '../../../static/DateIcon.png';
import TimeLeftIcon from '../../../static/TimeLeftIcon.png';
import CardBG from '../../../static/BookmarkBG.png';

function Card(props) {
  const {data, bookmarks, setBookmarks, navigation} = props;

  const eventPlatform = {
    leetcode: 'Leetcode',
    unstop: 'Unstop',
    gfg: 'GFG',
    codeForces: 'Code Forces',
    codeChef: 'Code Chef',
  };
  const cardWidth = (Dimensions.get('window').width - 60) / 2;

  const removeBookmark = () => {
    try {
      API.graphql({
        query: deleteBookmark,
        variables: {
          input: {
            id: data.id,
          },
        },
        authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookmark = () => {
    const otherBookmarks = bookmarks.filter(
      bookmark => bookmark.id !== data.id,
    );
    setBookmarks(otherBookmarks);
    removeBookmark();
  };

  const handlePress = () => {
    navigation.navigate('Event', {eventID: data.eventID, origin: 'Bookmarks'});
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={handleBookmark}>
        <View style={styles.bookmarkContainer}>
          <View>
            <Image source={MarkedFavIcon} style={styles.bookmarkIcon} />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View style={{width: cardWidth}}>
          <View style={styles.banner}>
            <ImageBackground
              source={CardBG}
              style={styles.bgImage}
              imageStyle={styles.bgImageStyle}>
              <Text style={styles.platform}>
                {eventPlatform[data.event.eventPlatform]}
              </Text>
            </ImageBackground>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{data.event.name}</Text>
            <View style={styles.flex}>
              <View style={styles.infoFlex}>
                <Image source={DateIcon} style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  {new Date(data.event.date).toDateString()}
                </Text>
              </View>
              <View style={styles.infoFlex}>
                <Image source={TimeLeftIcon} style={styles.infoIcon} />
                <Text style={styles.infoText}>
                  {Math.ceil(
                    Math.abs(
                      (new Date(data.event.date) - new Date()) /
                        (24 * 60 * 60 * 1000),
                    ),
                  )}{' '}
                  days left
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  bookmarkContainer: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    top: 15,
    right: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bookmarkIcon: {
    width: 18,
    height: 18,
  },
  banner: {
    width: '100%',
    height: 140,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    position: 'relative',
    flex: 1,
    backgroundColor: '#fff',
  },
  bgImage: {
    flex: 1,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  bgImageStyle: {
    borderRadius: 10,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 15,
  },
  name: {
    fontSize: 14,
    marginBottom: 10,
    color: '#000',
  },
  flex: {
    flexDirection: 'column',
    gap: 5,
  },
  infoFlex: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  infoIcon: {
    width: 10,
    height: 10,
  },
  infoText: {
    fontSize: 12,
  },
  platform: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    zIndex: 1,
    color: '#fff',
    fontSize: 16,
  },
});

export default Card;
