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
  TouchableWithoutFeedback,
  TextInput,
  Image,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import {
  getEvent,
  searchBookmarksForID,
  searchTodosInEvent,
} from '../../graphql/queries';
import {
  createBookmark,
  createTodo,
  deleteBookmark,
} from '../../graphql/mutations';
import TodoItem from '../commonComponents/TodoItem';
import BackIcon from '../../../static/BackIcon.png';
import FavIcon from '../../../static/FavIcon.png';
import MarkedFavIcon from '../../../static/MarkedFavIcon.png';
import DateIcon from '../../../static/DateIcon.png';
import TimeIcon from '../../../static/TimeIcon.png';
import TimeLeftIcon from '../../../static/TimeLeftIcon.png';
import DurationIcon from '../../../static/DurationIcon.png';

function Event(props) {
  const {navigation, route} = props;
  const {eventID, origin} = route.params;

  const [eventData, setEventData] = useState({});
  const [bookmarkID, setBookmarkID] = useState('');
  const [displayModal, setDisplayModal] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [todos, setTodos] = useState([]);

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

    const fetchTodos = async () => {
      try {
        const res = await API.graphql({
          query: searchTodosInEvent,
          variables: {
            filter: {
              eventID: {
                eq: eventID,
              },
            },
          },
        });
        setTodos(
          res.data.searchTodos.items.sort(
            (a, b) => new Date(a.date) - new Date(b.date),
          ),
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchEvent();
    fetchBookmark();
    fetchTodos();
  }, [eventID]);

  const toggleModal = () => {
    setDisplayModal(prev => !prev);
  };

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

  const handelCreateTodo = async () => {
    try {
      const ISOString = date.toISOString();
      const justDate = ISOString.substring(0, 10);
      const res = await API.graphql({
        query: createTodo,
        variables: {
          input: {
            eventID: eventData.id,
            eventName: eventData.name,
            date: justDate,
            description: description,
            completed: false,
          },
        },
      });
      console.log(res.data.createTodo);
      setDescription('');
      setDate(new Date());
      toggleModal();
    } catch (err) {
      console.log(err);
    }
  };

  const openEventURL = async () => {
    const supported = await Linking.canOpenURL(eventData.url);
    if (supported) {
      await Linking.openURL(eventData.url);
    } else {
      console.log(`error in opening ${eventData.url}`);
      Alert.alert('Could not open the URL');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handelBookmark}>
        <View style={styles.bookmarkContainer}>
          {bookmarkID.length === 0 ? (
            <Image source={FavIcon} style={styles.bookmarkIcon} />
          ) : (
            <Image source={MarkedFavIcon} style={styles.bookmarkIcon} />
          )}
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => navigation.navigate(origin)}>
        <View style={styles.backContainer}>
          <Image source={BackIcon} style={styles.backIcon} />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bannerContainer}></View>
      <View style={styles.mainContent}>
        <Text style={styles.name}>{eventData.name}</Text>
        <View style={styles.flex}>
          <View style={styles.infoFlex}>
            <Image source={DateIcon} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {new Date(eventData.date).toDateString()}
            </Text>
          </View>
          <View style={styles.infoFlex}>
            <Image source={TimeIcon} style={styles.infoIcon} />
            <Text style={styles.infoText}>{eventData.time} IST</Text>
          </View>
        </View>
        <View style={styles.timeLeftFlex}>
          <View style={styles.infoFlex}>
            <Image source={TimeLeftIcon} style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {' '}
              {Math.ceil(
                Math.abs(
                  (new Date(eventData.date) - new Date()) /
                    (24 * 60 * 60 * 1000),
                ),
              )}{' '}
              days left
            </Text>
          </View>
          {eventData.duration && (
            <View style={styles.infoFlex}>
              <Image source={DurationIcon} style={styles.infoIcon} />
              <Text style={styles.infoText}>{eventData.duration}</Text>
            </View>
          )}
        </View>
        <View style={styles.headingFlex}>
          <Text style={styles.heading}>Your Todo's for this Event</Text>
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.addTodoContainer}>
              <Text style={styles.addTodoIcon}>+</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.todosContainer}>
            {todos.map((data, index) => {
              return (
                <TodoItem
                  data={data}
                  key={index}
                  todos={todos}
                  setTodos={setTodos}
                />
              );
            })}
          </View>
        </ScrollView>
        <TouchableWithoutFeedback onPress={openEventURL}>
          <View style={styles.vistButton}>
            <Text style={styles.vistText}>Vist this in Web</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Modal isVisible={displayModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.modalHeading}>Add a Todo for this Event</Text>
            <TextInput
              style={styles.modalInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Type your Todo description"
            />
            <Text style={styles.modalHeading}>Pick the date for your Todo</Text>
            <DatePicker
              date={date}
              onDateChange={setDate}
              mode="date"
              androidVariant="nativeAndroid"
            />
            <View style={styles.modalFlex}>
              <TouchableWithoutFeedback onPress={toggleModal}>
                <View style={styles.cancelButton}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={handelCreateTodo}>
                <View style={styles.addButton}>
                  <Text style={styles.addText}>Add to your Todos</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          {/* <Text>Hello!</Text>
          <Button title="Hide modal" onPress={toggleModal} /> */}
        </View>
      </Modal>
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
  bookmarkIcon: {
    width: 24,
    height: 24,
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
  backIcon: {
    width: 16,
    height: 16,
  },
  bannerContainer: {
    height: '30%',
    width: '100%',
    backgroundColor: '#2f1f60',
  },
  mainContent: {
    backgroundColor: '#f5f7fb',
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
    gap: 76.6,
    alignItems: 'center',
    marginBottom: 25,
  },
  infoIcon: {
    width: 14,
    height: 14,
  },
  infoText: {
    fontSize: 12,
    color: '#656565',
  },
  headingFlex: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 14,
    color: '#000',
  },
  addTodoContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#249781',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTodoIcon: {
    color: '#fff',
  },
  todosContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '100%',
    padding: 20,
    backgroundColor: '#f5f7fb',
    borderRadius: 20,
  },
  modalHeading: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
  modalInput: {
    fontSize: 12,
    padding: 18,
    paddingLeft: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#000',
    // borderWidth: 1,
    // borderColor: '#000',
  },
  modalFlex: {
    flexDirection: 'column',
    gap: 10,
  },
  cancelButton: {
    height: 50,
    backgroundColor: '#daf5f1',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    color: '#249781',
  },
  addButton: {
    height: 50,
    backgroundColor: '#249781',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
  },
  addText: {
    color: '#fff',
  },
  vistButton: {
    width: '100%',
    backgroundColor: '#249781',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  vistText: {
    color: '#fff',
  },
});

export default Event;
