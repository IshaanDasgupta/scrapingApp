/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {API} from 'aws-amplify';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Pressable} from 'react-native';
import {listTodos} from '../../graphql/queries';
import TodoItem from '../commonComponents/TodoItem';

function Todo({navigation}) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await API.graphql({
          query: listTodos,
        });
        setTodos(res.data.listTodos.items);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Todos</Text>
      {todos.map(data => {
        return <TodoItem data={data} todos={todos} setTodos={setTodos} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    flexDirection: 'column',
    gap: 10,
    padding: 20,
  },
  heading: {
    fontSize: 14,
    color: '#000',
    marginBottom: 20,
  },
});

export default Todo;
