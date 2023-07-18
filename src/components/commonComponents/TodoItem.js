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
  TouchableWithoutFeedback,
  View,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {deleteTodo, updateTodo} from '../../graphql/mutations';
import {getTodo} from '../../graphql/queries';

function TodoItem(props) {
  const {data, todos, setTodos} = props;

  const [completed, setCompleted] = useState(false);
  const [todo, setTodo] = useState({});

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await API.graphql({
          query: getTodo,
          variables: {
            id: data.id,
          },
        });
        setTodo(res.data.getTodo);
        setCompleted(res.data.getTodo.completed);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTodo();
  }, [data]);

  const triggerCompleted = async () => {
    try {
      const res = await API.graphql({
        query: updateTodo,
        variables: {
          input: {
            id: data.id,
            completed: !completed,
          },
        },
      });
      console.log(res.data.updateTodo);
      setCompleted(prev => !prev);
    } catch (err) {
      console.log(err);
    }
  };

  const triggerDelete = async () => {
    try {
      const res = await API.graphql({
        query: deleteTodo,
        variables: {
          input: {
            id: data.id,
          },
        },
      });
      const rest = todos.filter(obj => obj.id !== data.id);
      setTodos(rest);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        {completed === true ? (
          <Text style={styles.completed}>{data.description}</Text>
        ) : (
          <Text style={styles.description}>{data.description}</Text>
        )}
        <Text style={styles.date}>{new Date(todo.date).toDateString()}</Text>
      </View>
      <TouchableWithoutFeedback onPress={triggerCompleted}>
        <View style={styles.editButton}></View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={triggerDelete}>
        <View style={styles.deleteButton}></View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  description: {
    fontSize: 14,
    color: '#000',
  },
  completed: {
    fontSize: 14,
    color: '#000',
    textDecorationLine: 'line-through',
  },
  date: {
    fontSize: 12,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#505050',
    marginRight: 10,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#fd7272',
  },
});

export default TodoItem;
