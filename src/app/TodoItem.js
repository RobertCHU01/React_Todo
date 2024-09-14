import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Mutation } from '@apollo/client/react/components';
import gql from 'graphql-tag';

const UPDATE_TODO = gql`
  mutation($id: Int!, $is_completed: Boolean!) {
    update_todos(where: {id: {_eq: $id}}, _set: {is_completed: $is_completed}) {
      affected_rows
      returning {
        id
        is_completed
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation($id: Int!) {
    delete_todos(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`;

const TodoItem = ({ todo }) => {
  return (
    <View style={styles.todoItem}>
      <Mutation mutation={UPDATE_TODO}>
        {(updateTodo) => (
          <TouchableOpacity
            onPress={() => {
              updateTodo({
                variables: { id: todo.id, is_completed: !todo.is_completed }
              });
            }}
          >
            <Text style={todo.is_completed ? styles.completedTodo : styles.todoText}>
              {todo.text}
            </Text>
          </TouchableOpacity>
        )}
      </Mutation>
      <Mutation 
        mutation={DELETE_TODO}
        update={(cache, { data: { delete_todos } }) => {
          const { todos } = cache.readQuery({ query: FETCH_TODOS });
          cache.writeQuery({
            query: FETCH_TODOS,
            data: { todos: todos.filter(t => t.id !== todo.id) },
          });
        }}
      >
        {(deleteTodo) => (
          <TouchableOpacity
            onPress={() => {
              deleteTodo({ variables: { id: todo.id } });
            }}
          >
            <Text style={styles.deleteButton}>Delete</Text>
          </TouchableOpacity>
        )}
      </Mutation>
    </View>
  );
};

const styles = StyleSheet.create({
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoText: {
    fontSize: 16,
  },
  completedTodo: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: '#888',
  },
  deleteButton: {
    color: 'red',
  },
});

export default TodoItem;