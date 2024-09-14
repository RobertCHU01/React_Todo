import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useMutation, gql } from '@apollo/client';

const INSERT_TODO = gql`
  mutation InsertTodo($text: String!, $userId: String!) {
    insert_todos(objects: [{text: $text, user_id: $userId, is_completed: false}]) {
      returning {
        id
        text
        is_completed
        user_id
      }
    }
  }
`;

const FETCH_TODOS = gql`
  query FetchTodos($userId: String!) {
    todos(where: {user_id: {_eq: $userId}}) {
      id
      text
      is_completed
    }
  }
`;

const Textbox = ({ userId }) => {
  const [text, setText] = useState('');

  const [insertTodo] = useMutation(INSERT_TODO, {
    update(cache, { data: { insert_todos } }) {
      const newTodo = insert_todos.returning[0];
      const existingTodos = cache.readQuery({
        query: FETCH_TODOS,
        variables: { userId }
      });

      if (existingTodos) {
        cache.writeQuery({
          query: FETCH_TODOS,
          variables: { userId },
          data: {
            todos: [...existingTodos.todos, newTodo]
          }
        });
      }
    },
    onError: (error) => {
      console.error('Error inserting todo:', error);
      console.error('GraphQL Errors:', error.graphQLErrors);
      console.error('Network Error:', error.networkError);
    }
  });

  const handleAddTodo = async () => {
    if (text.trim()) {
      try {
        const result = await insertTodo({ variables: { text, userId } });
        console.log('Todo insertion result:', result);
        setText('');
      } catch (error) {
        console.error('Error in handleAddTodo:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Enter a new todo"
      />
      <Button title="Add Todo" onPress={handleAddTodo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default Textbox;